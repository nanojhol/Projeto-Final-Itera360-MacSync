using System;
using MimeKit;
using MailKit.Security;
using MailKit.Net.Smtp;

namespace Projeto360Final.Servicos
{
    public class SmtpEmailService
    {
        private readonly string _host;
        private readonly int _port;
        private readonly string _user;
        private readonly string _pass;
        private readonly string _from;

        public SmtpEmailService(string host, int port, string user, string pass, string from)
        {
            _host = host;
            _port = port;
            _user = user;
            _pass = pass;
            _from = from;
        }

        public void Enviar(string destinatario, string assunto, string corpoHtml)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_from));
            message.To.Add(MailboxAddress.Parse(destinatario));
            message.Subject = assunto;

            message.Body = new TextPart("html")
            {
                Text = corpoHtml
            };

            using var client = new SmtpClient();
            client.ServerCertificateValidationCallback = (s, c, h, e) => true;

            client.Connect(_host, _port, SecureSocketOptions.StartTls);

            client.Authenticate(_user, _pass);
            client.Send(message);
            client.Disconnect(true);
        }
    }
}
