# Cloud Computing Assignment 2
##TODO
**@Aditya-Bharadwaj**
   Add and remove a book and its details (Description, Price, Number of copies)

**@Apaar** Determine/Modify the price of a book and remove a book after it is selected/after it goes out of stock

**Vinayak Shenoy** Query for all books in a category, 10 at a time.
	
---

Adding a category:
`$ curl -X PUT https://295204ce-46c2-4803-a3fd-c028c41b89d9-bluemix.cloudant.com/_api/v2/user/config/cors -u 295204ce-46c2-4803-a3fd-c028c41b89d9-bluemix -H 'Content-Type: application/json' -T <file.json>`

To get current CORS status
`$ curl -X GET https://295204ce-46c2-4803-a3fd-028c41b89d9-bluemix.cloudant.com/_api/v2/user/config/cors -u 295204ce-46c2-4803-a3fd-c028c41b89d9-bluemix`

You'll be asked to enter the password on executing. Response should be 
```
{
  "enable_cors": true,
  "allow_credentials": true,
  "origins": [
    "https://cc-a2-bookkart.mybluemix.net"
  ]
}
```

To set current CORS configuration to this, do

`$ curl -X PUT https://295204ce-46c2-4803-a3fd-028c41b89d9-bluemix.cloudant.com/_api/v2/user/config/cors -u 295204ce-46c2-4803-a3fd-c028c41b89d9-bluemix -H 'Content-Type: application/json' -T cors.json`
