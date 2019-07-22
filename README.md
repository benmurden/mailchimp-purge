# Mailchimp Purge
Automatically archive unsubscribed contacts from Mailchimp - and reduce your costs.

## Usage
```Terminal
$ npm i mailchimp-purge
$ npm run start <API_KEY> <LIST_ID>
```

## Motivation
Mailchimp charge for contacts you have in lists, even if they are unsubscribed. You can't send marketing e-mails to unsubscribed contacts, so if that's all you use Mailchimp for, they are dead weight adding to your paid plan totals.

Furthermore, you can only archive 100 contacts at a time from the Mailchimp website management interface. If you have thousands of contacts, that's a lot of clicking around. This tool was created to alleviate that specific pain.

## License
MIT