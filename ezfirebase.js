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
   * @return {string} A confirmation
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
   * With this function you can search for values in a specified table with multiple objects. The result you get is an array with all the objects in it that correspond with the keyword you are looking for.
   *
   * @param {string} table - The name of the table you want to search in. I.e. clients or articles.
   * @param {string} keyword - A value you are looking for. I.e. a name, adress or age.
   * @return {string} A good string
   *
   * @example
   *
   *     ezfb.search("clients", "Jan").then((searchResponse) => {
   *         *Work with the searchResponse data here.*
   *     });
   */

  public_functions.search = async function (table, keyword) {
    let searchResponse = [];

    var query = firebase.database().ref(table).orderByKey();
    const snapshot = await query.once("value");
    snapshot.forEach(function (childSnapshot) {
      let childData = childSnapshot.val();

      let childDataValues = Object.values(childData);

      if (childDataValues.toString().indexOf(keyword) != -1) {
        let searchResult = {};

        searchResult = childData;

        searchResponse.push(searchResult);
      }
    });

    if (searchResponse.length === 0) {
      searchResponse[0] = "No matches found";
    }

    return searchResponse;
  };

  /**
   * With this function you can search for values in a specified table with multiple objects. The result you get is an array with all the objects in it that correspond with the keyword you are looking for.
   *
   * @param {string} table - The name of the table you want to search in. I.e. clients or articles.
   * @param {string} id - The id of the item you are looking for.
   * @return {string} An array with an object in it containing all the data you were looking for.
   *
   * @example
   *
   *     ezfb.searchById('clients', 2).then((result) => {
   *         Work with the reesult here
   *     });
   */

  public_functions.searchById = async function (table, id) {
    let resultt = [];
    var query = firebase
      .database()
      .ref(table + "/" + id)
      .orderByKey();
    const snapshot = await query.once("value").then(function (snapshot) {
      let result = snapshot.val();

      resultt.push(result);
    });

    return resultt;
  };

  /**
   * With this function you can update data in a specified table in the database. You send an object with all the info you want to update in it.
   *
   * @param {string} reference - The table it should be updated in. For example the clients table.
   * @param {string} dataToAdd - An object with all the data you want to update to the database.
   * @return {string} A good string
   *
   */

  public_functions.update = function (reference, dataToAdd) {
    firebase.database().ref(reference).update(dataToAdd);
  };

  /**
   * With this function you can remove data from a specific location.
   *
   * @param {string} reference - The location which should be removed from the database
   *
   */

  public_functions.remove = function (reference) {
    firebase.database().ref(reference).remove();
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

    // Get all the select elements and save the data to the data object.
    const formTextareas = form.getElementsByTagName("textarea");

    if (formTextareas.length >= 1) {
      for (let i = 0; i < formTextareas.length; i += 1) {
        const key = formTextareas[i].getAttribute("name");
        const id = formTextareas[i].getAttribute("id");
        const value = eval(`cke${id}.getData()`);
        data[key] = value;
      }
    }

    return data;
  };

  /**
   * With this function you can easily convert textareas to CKEditors, watch out though, it converts ALL textareas.
   */

  public_functions.loadCKE = function () {
    const textareas = document.getElementsByTagName("textarea");

    for (let i = 0; i < textareas.length; i += 1) {
      const id = textareas[i].getAttribute("id");

      eval(`let cke${id};`);

      ClassicEditor.create(document.querySelector(`#${id}`), {
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "blockQuote",
        ],
      })
        .then((newEditor) => {
          eval(`cke${id} = newEditor;`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  /**
   * With this function you can easily set the data for a specific form
   *
   * @param {string} reference - The table where the ID should be checked in.
   * @param {string} id - The ID.
   * @param {string} formName - The name of the form.
   *
   */

  public_functions.setFormData = function (reference, id, formName) {
    this.searchById(reference, id).then((result) => {
      const form = document.querySelector(`#${formName}`);

      // Get all the input elements and save the data to the data object.
      const formInputs = form.getElementsByTagName("input");

      if (formInputs.length >= 1) {
        for (let i = 0; i < formInputs.length; i += 1) {
          const formInput = formInputs[i];
          const key = formInput.getAttribute("name");
          formInput.value = eval(`result[0].${key}`);
        }
      }

      //   Get all the select elements and save the data to the data object.
      const formSelects = form.getElementsByTagName("select");

      if (formSelects.length >= 1) {
        for (let i = 0; i < formSelects.length; i += 1) {
          const formSelect = formSelects[i];
          const key = formSelect.getAttribute("name");
          formSelect.value = eval(`result[0].${key}`);
        }
      }

      // Get all the select elements and save the data to the data object.
      const formTextareas = form.getElementsByTagName("textarea");

      if (formTextareas.length >= 1) {
        for (let i = 0; i < formTextareas.length; i += 1) {
          const key = formTextareas[i].getAttribute("name");
          const id = formTextareas[i].getAttribute("id");
          eval(`cke${id}.setData(result[0].${key})`);
        }
      }
    });
  };

  return public_functions;
})();
