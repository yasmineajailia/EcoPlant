const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send email verification
 * @param {string} email - User email
 * @param {string} firstName - User first name
 * @param {string} verificationToken - Verification token
 */
exports.sendVerificationEmail = async (email, firstName, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  
  const mailOptions = {
    from: `"Pépinière" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🌱 Confirmez votre adresse email - Pépinière',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .button:hover { background: #45a049; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌿 Bienvenue chez Pépinière !</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${firstName},</h2>
              <p>Merci de vous être inscrit sur notre site !</p>
              <p>Pour compléter votre inscription, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Confirmer mon email</a>
              </div>
              <p>Ou copiez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #4CAF50; font-size: 12px;">${verificationUrl}</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Ce lien expirera dans 24 heures.</strong>
              </p>
              <p style="color: #999; font-size: 12px;">
                Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Pépinière. Tous droits réservés.</p>
              <p>🌱 Votre partenaire pour un intérieur verdoyant</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de vérification envoyé à ${email}`);
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw new Error('Impossible d\'envoyer l\'email de vérification');
  }
};

/**
 * Send welcome email after verification
 * @param {string} email - User email
 * @param {string} firstName - User first name
 */
exports.sendWelcomeEmail = async (email, firstName) => {
  const mailOptions = {
    from: `"Pépinière" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Bienvenue chez Pépinière !',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Email vérifié avec succès !</h1>
            </div>
            <div class="content">
              <h2>Félicitations ${firstName} !</h2>
              <p>Votre compte a été activé avec succès. Vous pouvez maintenant profiter de tous nos services :</p>
              <ul>
                <li>🛒 Parcourir notre catalogue de plantes</li>
                <li>❤️ Créer votre liste de favoris</li>
                <li>🚚 Passer des commandes</li>
                <li>🌿 Accéder aux guides d'entretien</li>
              </ul>
              <div style="text-align: center;">
                <a href="${process.env.CLIENT_URL}/plants" class="button">Découvrir le catalogue</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 Pépinière. Tous droits réservés.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de bienvenue envoyé à ${email}`);
  } catch (error) {
    console.error('❌ Erreur envoi email de bienvenue:', error);
  }
};

/**
 * Send order confirmation email
 * @param {string} email - Customer email
 * @param {string} firstName - Customer first name
 * @param {object} order - Order object with details
 */
exports.sendOrderConfirmationEmail = async (email, firstName, order) => {
  // Generate order items HTML
  const orderItemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
        <div style="display: flex; align-items: center;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">` : '🌱'}
          <strong>${item.name}</strong>
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
      <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">${item.price.toFixed(2)} TND</td>
      <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;"><strong>${(item.price * item.quantity).toFixed(2)} TND</strong></td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Pépinière" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Confirmation de commande #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 650px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #ffffff; padding: 30px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; }
            .order-number { background: #f0f9f0; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .order-number strong { color: #4CAF50; font-size: 18px; }
            .section { margin: 30px 0; }
            .section h2 { color: #4CAF50; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; color: #333; }
            .total-row { background: #f0f9f0; font-size: 18px; }
            .total-row td { padding: 20px 15px; border-bottom: none; }
            .address { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; }
            .status { display: inline-block; background: #fff3cd; color: #856404; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 14px; }
            .button { display: inline-block; background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { background: #f5f5f5; padding: 30px; text-align: center; color: #666; font-size: 14px; border-radius: 0 0 10px 10px; border-top: 2px solid #e0e0e0; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Commande confirmée !</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Merci pour votre confiance</p>
            </div>
            
            <div class="content">
              <h2 style="color: #333; font-size: 24px;">Bonjour ${firstName},</h2>
              <p style="font-size: 16px;">Nous avons bien reçu votre commande et nous la préparons avec soin ! 🌱</p>
              
              <div class="order-number">
                <p style="margin: 0; color: #666;">Numéro de commande</p>
                <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong>
              </div>

              <div class="section">
                <h2>📦 Détails de la commande</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th style="text-align: center;">Quantité</th>
                      <th style="text-align: right;">Prix unitaire</th>
                      <th style="text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItemsHtml}
                    <tr class="total-row">
                      <td colspan="3" style="text-align: right;"><strong>Total de la commande :</strong></td>
                      <td style="text-align: right;"><strong style="color: #4CAF50; font-size: 20px;">${order.totalPrice.toFixed(2)} TND</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="section">
                <h2>🚚 Informations de livraison</h2>
                <div class="address">
                  <p style="margin: 5px 0;"><strong>Destinataire :</strong> ${order.deliveryInfo.firstName} ${order.deliveryInfo.lastName}</p>
                  <p style="margin: 5px 0;"><strong>Téléphone :</strong> ${order.deliveryInfo.phone}</p>
                  <p style="margin: 5px 0;"><strong>Adresse :</strong></p>
                  <p style="margin: 5px 0 5px 20px;">
                    ${order.deliveryInfo.address.street}<br>
                    ${order.deliveryInfo.address.postalCode} ${order.deliveryInfo.address.city}<br>
                    ${order.deliveryInfo.address.country}
                  </p>
                </div>
              </div>

              <div class="section">
                <h2>📊 Statut de la commande</h2>
                <p>
                  <span class="status">⏳ En attente de préparation</span>
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 15px;">
                  Vous recevrez un email dès que votre commande sera expédiée.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/order-confirmation/${order._id}" class="button">Voir ma commande</a>
              </div>

              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2196F3; margin-top: 30px;">
                <p style="margin: 0; color: #1976D2;"><strong>💡 Besoin d'aide ?</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">
                  Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter.
                </p>
              </div>
            </div>

            <div class="footer">
              <p><strong>Merci de votre confiance ! 🌿</strong></p>
              <p>© 2025 Pépinière. Tous droits réservés.</p>
              <p style="font-size: 12px; color: #999; margin-top: 15px;">
                Cet email a été envoyé à ${email} suite à votre commande sur notre site.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de confirmation de commande envoyé à ${email}`);
  } catch (error) {
    console.error('❌ Erreur envoi email de confirmation:', error);
    // Don't throw error - order was created successfully, email is just a bonus
  }
};
