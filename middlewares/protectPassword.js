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

    res.send(protectedBody);
  } else {
    const protectedBody = removePass(body);

    res.json(protectedBody);
  }  
}

export default protectPassword;

