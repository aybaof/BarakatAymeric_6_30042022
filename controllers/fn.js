exports.validateInput = (input, type ,errorMsg) => {
    return new Promise((resolve , reject) => {
        typeof(input) === type ? resolve() : reject({error: errorMsg})
      })
}