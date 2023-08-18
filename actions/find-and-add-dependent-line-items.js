const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: process.env.TOKEN })
exports.main = async (event, callback) => {
  
  const lineItems = JSON.parse(event.inputFields.lineItems);
  
  const baseLineItems = lineItems.results.filter(line_item => line_item.properties.dependent_skus == null && line_item.properties.hs_sku !== null).map(line_item => {
    return {
        filters: [{
          propertyName: "dependent_skus",
          operator: "CONTAINS_TOKEN",
          value: line_item.properties.hs_sku
        }]
      }
  });
  
  //Get Products based on parent line item
  const products = await hubspotClient.crm.products.searchApi.doSearch({filterGroups: baseLineItems,limit:100});
  
  //Add Line Items to Deal
  await hubspotClient.apiRequest({
    method: "POST",
    path: "/crm/v3/objects/line_items/batch/create",
    body: {inputs: products.results.map(product => { 
      return {
        properties: {
          hs_product_id: product.id,
          quantity: 1,
          hs_position_on_quote: 100
        },
        associations: [
          {
            to: {
              id: event.object.objectId
            },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 20
              }
          ]
          }
        ]
      }
    })}
  });
  
  //Return base product line items
  callback({
    outputFields: {}
  });
}
