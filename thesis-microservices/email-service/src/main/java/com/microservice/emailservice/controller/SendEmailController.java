package com.microservice.emailservice.controller;

import com.microservice.emailservice.model.EmailByBranch;
import com.microservice.emailservice.repository.EmailByBranchRepository;
import com.microservice.emailservice.request.EmailRequest;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailSender;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/email")
public class SendEmailController {
    @Autowired
    private MailSender mailSender;
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private EmailByBranchRepository emailByBranchRepository;


    @Value("${spring.mail.username}")
    private String sender;


    // Sending a simple Email
//    @PostMapping("/sendMail")
//    public String
//    sendMail(@RequestBody EmailRequest details) {
//        try {
//            SimpleMailMessage mailMessage = new SimpleMailMessage();
//            mailMessage.setFrom(sender);
//            mailMessage.setTo(details.getSendTo());
//            mailMessage.setSubject(details.getSubject());
//            mailMessage.setText(details.getMessage() + "\n" + details.getProduct());
//            mailSender.send(mailMessage);
//            return "Gửi mail thành công!";
//        }
//        catch (Exception e) {
//            return "Lỗi gửi mail : " + e;
//        }
//    }
    @PostMapping("/sendMailBranch/{branchId}")
    public String
    sendMailCustom(@RequestBody EmailRequest details,@PathVariable String branchId) {
        MimeMessage mimeMessage
                = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;
        try {
            mimeMessageHelper
                    = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(sender);
            mimeMessageHelper.setSubject(details.getSubject());
            boolean html = true;
            mimeMessageHelper.setText("<body><b>Xin chào quý khách</b>,<br>" +
                    "<i>Gửi khách hàng những thông tin sự kiện của </i><b>" +
                    details.getBranch() + "</b>,<br>" +
                    "<i>"+details.getMessage()+"</i><br>" +
                    "<i>Địa chỉ trang web " + details.getWebsite() + "</i> <br>" +
                    "<b>Xin chân thành cám ơn!</b></body>", html);
            FileSystemResource file
                    = new FileSystemResource(
                    new File(details.getAttachment()));

            mimeMessageHelper.addAttachment(
                    file.getFilename(), file);

            List<EmailByBranch> emailByBranches = emailByBranchRepository.findByBranchId(branchId);
            for (EmailByBranch emailUser: emailByBranches) {
                mimeMessageHelper.setTo(emailUser.getEmailCustomer());
                javaMailSender.send(mimeMessage);
            }
            return "Gửi mail thành công!";
        } catch (Exception e) {
            return "Lỗi gửi mail : " + e;
        }
    }


}
