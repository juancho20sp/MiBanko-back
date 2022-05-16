
const tip_docs = ["CC","CE","TI"]
const acc_type = ["AHORROS", "CORRIENTE"]
const alpahabetic = new RegExp('^[A-ZÁÉÍÓÚÑ\s]+$', 'i');
const mail =  new RegExp('^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$');
class validations{
  constructor(){}


  validateNumerics(data){
    if(Number(data).isNaN){
      return true
    }
    else{
      return false
    }
  }

  validateDocs(data){
    return tip_docs.includes(data.toUpperCase())
  }

  validateAccType(data){
    return acc_type.includes(data.toUpperCase())
  }

  validateAlphabetic(data){
    return alpahabetic.test(data)
  }

  validateMail(data){
    return mail.test(data)
  }

  validateBools(data){
    return data===true || data===false
  }

}

module.exports= validations;
