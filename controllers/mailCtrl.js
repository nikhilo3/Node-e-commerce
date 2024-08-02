import nodemailer from 'nodemailer';

const sendMail = async (data,req,res) => {


    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MP,
        },
    });
    // console.log(process.env.MAIL_ID,process.env.MP);

    
    // send mail with defined transport object
    await transporter.sendMail({
        from: '"hey 👻" <abc>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });
}

export { sendMail }