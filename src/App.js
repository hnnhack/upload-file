import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Image, Message, Header, Icon, Table } from 'semantic-ui-react';

const INITIAL_RECEIPT = {
  image: '',
};

const App = () => {
  const [receipt, setReceipt] = useState(INITIAL_RECEIPT);
  const [imagePreview, setImagePreview] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState({});

  useEffect(() => {
    const isReceipt = Object.values(receipt).every((el) => Boolean(el));
    isReceipt ? setDisabled(false) : setDisabled(true);
  }, [receipt]);

  const handleChange = (event) => {
    const { files } = event.target;
    setReceipt((prevState) => ({ ...prevState, image: files[0] }));
    console.log(receipt);
    setImagePreview(window.URL.createObjectURL(files[0]));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const API =
      'https://custom-ocr.klippa.com/api/v1/parseDocument?X-Auth-Key=Bm4CTHGza7FWYE8t6gtkGezwjcZrFrrn';
    try {
      setLoading(true);
      setError('');
      const data = new FormData();
      data.append('document', receipt.image);
      const header = new Headers();
      const response = await fetch(API, { method: 'post', body: data, headers: header });
      const result = await response.json();
      setResponse(result.data);
      setReceipt(INITIAL_RECEIPT);
      setImagePreview('');
      setSuccess(true);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header as="h2" block color="green">
        <Icon name="file" color="green" />
        Upload Receipt or Invoice
      </Header>
      <Form loading={loading} error={Boolean(error)} success={success} onSubmit={submitHandler}>
        <Message
          error
          header="Oops! Please check your upload presets on your Klippa account. "
          content={error}
        />
        <Message success icon="check" header="Success!" content="Your file(s) has been uploaded" />
        <Form.Field
          control={Input}
          name="image"
          type="file"
          accept="image/*"
          content="Select Image"
          onChange={handleChange}
        />
        <Image src={imagePreview} rounded centered size="small" />
        <Form.Field
          control={Button}
          disabled={disabled || loading}
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
      <Header as="h2">Responsed Data from API</Header>
      <Table compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Currency</Table.HeaderCell>
            <Table.HeaderCell>Customer Name</Table.HeaderCell>
            <Table.HeaderCell>Document Type</Table.HeaderCell>
            <Table.HeaderCell>Merchant City</Table.HeaderCell>
            <Table.HeaderCell>Merchant Name</Table.HeaderCell>
            <Table.HeaderCell>Order Number</Table.HeaderCell>
            <Table.HeaderCell>Raw Text</Table.HeaderCell>
            <Table.HeaderCell>Purchase Date</Table.HeaderCell>
            <Table.HeaderCell>Recept Number</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>{response.currency}</Table.Cell>
            <Table.Cell>{response.customer_name}</Table.Cell>
            <Table.Cell>{response.document_type}</Table.Cell>
            <Table.Cell>{response.merchant_city}</Table.Cell>
            <Table.Cell>{response.merchant_name}</Table.Cell>
            <Table.Cell>{response.order_number}</Table.Cell>
            <Table.Cell>{response.raw_text}</Table.Cell>
            <Table.Cell>{response.purchasedate}</Table.Cell>
            <Table.Cell>{response.receipt_number}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

export default App;
{
  /* amount: 15406
amount_change: 0
amountexvat: 15406
barcodes: null
currency: "USD"
customer_address: ""
customer_bank_account_number: ""
customer_bank_account_number_bic: ""
customer_city: ""
customer_coc_number: ""
customer_country: ""
customer_email: ""
customer_municipality: ""
customer_name: "John Smith"
customer_number: ""
customer_phone: ""
customer_province: ""
customer_reference: ""
customer_vat_number: ""
customer_website: ""
customer_zipcode: ""
date: "2019-11-02T00:00:00"
document_subject: ""
document_type: "invoice"
hash: "fecf06ddd21576499e97963d4b646e7439a1ebee"
hash_duplicate: true
invoice_number: "US-001"
invoice_type: "invoice"
lines: [{…}]
matched_keywords: null
matched_lineitems: null
merchant_address: "Harvest Lane 1912"
merchant_bank_account_number: ""
merchant_bank_account_number_bic: ""
merchant_bank_domestic_account_number: ""
merchant_bank_domestic_bank_code: ""
merchant_city: "New York"
merchant_coc_number: ""
merchant_country: ""
merchant_country_code: "US"
merchant_email: ""
merchant_id: ""
merchant_main_activity_code: ""
merchant_municipality: ""
merchant_name: "East Repair Inc."
merchant_phone: ""
merchant_province: ""
merchant_vat_number: ""
merchant_website: ""
merchant_zipcode: "12210"
order_number: "2312/2019"
package_number: ""
payment_auth_code: ""
payment_card_account_number: ""
payment_card_bank: ""
payment_card_issuer: ""
payment_card_number: ""
payment_due_date: "2019-02-26T00:00:00"
payment_slip_code: ""
payment_slip_customer_number: ""
payment_slip_reference_number: ""
paymentmethod: ""
purchasedate: "2019-11-02"
purchasetime: "00:00:00"
raw_text: "East Repair Inc.                                                                               INVOICE↵1912 Harvest Lane↵New York, NY 12210↵Bill To                               Ship To                                     Invoice #          US-001↵John Smith                             John Smith                             Invoice Date        11/02/2019↵2 Court Square                        3787 Pineview Drive↵New York, NY 12210                    Cambridge, MA 12210                             P.O.#       2312/2019↵                                                                                 Due Date         26/02/2019↵  QTY                       DESCRIPTION                          UNIT PRICE               AMOUNT↵    1↵           Front and rear brake cables                                   100.00                      100.00↵    2↵           New set of pedal arms                                          15.00                       30.00↵    3      Labor 3hrs                                                      5.00                       15.00↵                                                                       Subtotal                      145.00↵                                                               Sales Tax 6.25%                         9.06↵                                                                     TOTAL                      $154.06↵Terms & Conditions↵Payment is due within 15 days↵Please make checks payable to: East Repair Inc."
receipt_number: "US-001"
server: ""
shop_number: ""
table_group: ""
table_number: ""
terminal_number: ""
transaction_number: ""
transaction_reference: ""
vatamount: 0 */
}
