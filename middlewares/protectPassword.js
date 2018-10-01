const removePass = (obj) => Object.entries(obj).reduce((acc, item) => {
      const [key, value] = item;
      return (key !== 'password' ? { ...acc, [key]: value } : acc);
    }, {});

const protectPassword = (req, res, next) => {
  const { body } = res;

  if (Object.keys(body).includes('personList')) {
    const protectedBody = body.personList.map(item => {
      return removePass(item);
    });

    res.json({
      status: 'success',
      data: protectedBody,
    });
  } else {
    const protectedBody = removePass(body);

    res.json({
      status: 'success',
      data: protectedBody,
    });
  }  
}

export default protectPassword;

