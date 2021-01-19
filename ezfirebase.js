const ezfb = (function () {
  let public_functions = {};

  /**
   * With this function you can initialize your project based on the firebaseConfig object that you can find in the console.
   *
   * @param {string} init - The firebaseConfig object that you can find in your project settings in the Firebase console.
   * @return {string} A confirmation that the project has been succesfully initialized.
   *
   */

  public_functions.init = function (firebaseConfig) {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    console.log("Firebase has been succesfully initialized.");
  };

  /**
   * With this function you can add data into a specified table in the database. The data you add needs to be an object.
   *
   * @param {string} reference - The reference the data should be added to. For example 'clients' or 'items'.
   * @param {string} data - An object with all the data you want to add to the database.
   * @return {string} A good string
   *
   */

  public_functions.add = async function (reference, data) {
    var ID = function () {
      return "_" + Math.random().toString(36).substr(2, 9);
    };

    let dataToAdd = data;

    let uniqueid = ID();

    var ref = firebase.database().ref(reference);
    const snapshot = await ref.once("value");
    orderid = snapshot.numChildren() + 1;

    dataToAdd.id = uniqueid;
    dataToAdd.orderid = orderid;

    firebase
      .database()
      .ref(reference + "/" + uniqueid)
      .set(dataToAdd);

    let result = dataToAdd;

    return result;
  };

  /**
   * With this function you can easily collect the data from a specified form
   *
   * @param {string} formName - The name of the form.
   * @return {object} An object with all the form data in it.
   *
   */

  public_functions.getFormData = async function (formName) {
    let data = {};

    const form = document.querySelector(`#${formName}`);

    // Get all the input elements and save the data to the data object.
    const formInputs = form.getElementsByTagName("input");

    if (formInputs.length >= 1) {
      for (let i = 0; i < formInputs.length; i += 1) {
        const formInput = formInputs[i];
        const key = formInput.getAttribute("name");
        const value = formInput.value;

        data[key] = value;
      }
    }

    // Get all the select elements and save the data to the data object.
    const formSelects = form.getElementsByTagName("select");

    if (formSelects.length >= 1) {
      for (let i = 0; i < formSelects.length; i += 1) {
        const formSelect = formSelects[i];
        const key = formSelect.getAttribute("name");
        const value = formSelect.value;

        data[key] = value;
      }
    }

    return data;
  };

  return public_functions;
})();
