const db = require("../models");
const asynchandler = require("express-async-handler");
const sequelize = require("../config/connection");

const addOrder = asynchandler(async (req, res) => {
  // بدء معاملة
  const transaction = await sequelize.transaction();

  try {
    console.log(req.user.id);

    // إنشاء الطلب
    const order = await db.Order.create(
      {
        customerId: req.user.id,
        totalAmount: 0, // سيتم تحديثه لاحقًا
      },
      { transaction } // تمرير المعاملة
    );
    console.log(order);

    let totalAmount = 0;
    const products = req.body.products;
    console.log(products);

    if (products && products.length > 0) {
      // تحضير قائمة المنتجات لإضافتها إلى الطلب
      const orderProducts = [];

      for (const product of products) {
        console.log(product.id);

        // التحقق من وجود المنتج
        const productData = await db.Product.findByPk(product.id, {
          transaction,
        });

        if (!productData) {
          await transaction.rollback();
          return res
            .status(404)
            .json({ error: `Product with ID ${product.id} not found` });
        }

        // حساب المبلغ الإجمالي
        totalAmount += productData.price * product.quantity;

        // إضافة المنتج إلى قائمة OrderProducts
        orderProducts.push({
          orderId: order.id,
          productId: product.id,
          quantity: product.quantity,
        });
      }

      // إضافة جميع المنتجات إلى الطلب باستخدام bulkCreate
      await db.OrderProduct.bulkCreate(orderProducts, { transaction });
    } else {
      await transaction.rollback();
      return res.status(400).json({ error: "No products provided" });
    }

    // تحديث المبلغ الإجمالي للطلب
    order.totalAmount = totalAmount;
    await order.save({ transaction });

    // الالتزام بالمعاملة
    await transaction.commit();

    // استرجاع الطلب مع تفاصيل المنتجات
    const orderWithDetails = await db.Order.findByPk(order.id, {
      include: [
        {
          model: db.Product,
          as: "products",
          through: { attributes: ["quantity"] }, // تضمين الكمية من الجدول الوسيط
          attributes: ["id", "name", "price"], // الأعمدة المطلوبة فقط من جدول المنتجات
        },
      ],
    });

    return res.status(201).json({
      message: "Order added successfully",
      order: orderWithDetails,
    });
  } catch (error) {
    // التراجع عن المعاملة عند حدوث خطأ
    await transaction.rollback();
    console.error("Error adding order:", error);
    return res.status(500).json({ error: "Failed to add order" });
  }
});

module.exports = { addOrder };
