# Add Dependent Line Items To Deals
## Allow users to implement product dependency on a deal

Users can add base products and the deal will adjust associated line items to remove products that aren’t dependent on the current base product and add products that are. The specific user case for the customer was they wanted users to be able to add a single line item and have one or more line items automatically added based on the initial one.

### Customer Use Case

The customer had a set of paid services that clients could purchase. One of the line items (the base service) held the actual costs, and the other line items were there as add-ons/descriptions of the services included in that base service. This way quotes would show you purchased the “Gold Service” for $2,000 and then the additional no cost line items would describe all the services you get for that. The customer didn’t want their reps to have to manually select all of these things every time they were selling a package like this and wanted to automate the line items.

### Product Setup

There are a few ways to set up the product object. In the end we need a property that will be used to identify the dependency between it and another product. For example, we can have a multi-select property where the internal values of the options align to product IDs or SKUs. When we add a product we’ll look for any other product where the dependent ID or dependent SKU value matches and add it as well. Multi-select makes this future proof, but we could also possibly just use a single line text and enter a csv of values. Single line text will be less maintenance but more error prone. In my example I’m using a single line text.

If using product ids, they can be obtained from the API or from viewing the source code of the products page and reading the data-line-item-id.
 
### Workflow Setup
The process relies on a single deal workflow that checks for deals with associated line items that have no dependent SKUs configured. The workflow can allow for re-enrollment when the deal amount changes. The workflow is split into three custom code workflow actions.

- [Get Line Items](./actions/get-line-items.js)
- [Delete Existing Dependent Line Items](./actions/delete-existing-line-items.js)
- [Find & Add New Depending Line Items](./actions/find-and-add-dependent-line-items.js)

### Considerations / Notes
- Handling manual adjustments to line items.
- Nested dependencies
- Based on Search API limited to 3 base products SKUs. Could be expanded with graphQL.
- Ensure enrollment always happens on line item change in case the amount doesn’t change.
