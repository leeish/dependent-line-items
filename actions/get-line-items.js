const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: process.env.TOKEN });

exports.main = async (event, callback) => {

  //Get Line Items IDs for Deal
  const dealWithLineItems = await hubspotClient.crm.deals.basicApi.getById(
    event.object.objectId,
    undefined,
    undefined,
    ["line_items"]
  )
  
  //Get Line Items
  const lineItems = await hubspotClient.crm.lineItems.batchApi.read({
    inputs: dealWithLineItems.associations["line items"].results,
    properties: [
      "hs_sku",
      "dependent_skus",
      "hs_product_id"
    ]
  });
  
  //Return base product line items
  callback({
    outputFields: {lineItems: lineItems}
  });
}
