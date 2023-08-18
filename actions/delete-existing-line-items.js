const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: process.env.TOKEN })
exports.main = async (event, callback) => {

  const lineItems = JSON.parse(event.inputFields.lineItems);
  
  console.log(lineItems)

  //Delete non dependent line items
  const lineItemsToDelete = lineItems.results.filter(line_item => line_item.properties.dependent_skus != null);
  if(lineItemsToDelete.length > 0){
    await hubspotClient.crm.lineItems.batchApi.archive({
      inputs: lineItemsToDelete
    });
  }

  //Return base product line items
  callback({
    outputFields: {}
  });
}
