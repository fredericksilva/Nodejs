'use strict';

let config = require('app/config/config');

let sender = config.services.hermes.notification_sender;
let senderId = config.services.hermes.notification_sender_id;

class Notification {

    constructor(logger, hermes) {
        this.logger = logger;
        this.hermes = hermes;
    }

    sendEmail(email, subject, template, params) {
        if (!template) {
            this.logger.error('No email template configured, unable to send notification');
            return Promise.reject(
                new Error('No email template configured')
            );
        }

        let packet = {
            medium: 'email',
            name: template,
            recipient: email,
            subject: subject,
            sender: sender,
            sender_id: senderId,
            params: params
        };

        if (parseInt(config.dev_mode) === 1) {
            packet.dry_run = true;
        }

        return new Promise((resolve, reject) => {
            this.hermes.sendNotification(packet, (err) => {
                if (err) {
                    this.logger.error(`Error sending email via Hermes: ${err.toString()}`);
                    return reject(new Error('Unable to send email via Hermes'));
                }

                this.logger.info(`Sent email successfully to ${email} with subject: ${subject}`);
                return resolve();
            });
        });
    }
}

module.exports = Notification;
