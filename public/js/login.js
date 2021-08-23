window.onload = () => {
  var instance = new Razorpay({
    key_id: 'rzp_test_bMTizefZZLDlxd',
    key_secret: '6PuLmczAtDdNj4niYj0FXMDm',
  });

  instance.payments
  .all()
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });
}