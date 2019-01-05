var form = document.querySelector('#register-form');
var loginForm = document.querySelector('#login-form');

var createNewApplicationForm = document.querySelector('#create-application');
var deleteApplicationForm = document.querySelector('#delete-application');
var updateApplicationForm = document.querySelector('#update-application');

var createNewPasswordForm = document.querySelector('#create-password');
var deletePasswordForm = document.querySelector('#delete-password');
var updatePasswordForm = document.querySelector('#update-password');


if (form) form.addEventListener('submit', submitRegisterForm);

if (loginForm) loginForm.addEventListener('submit', submitLoginForm);

if (createNewApplicationForm) createNewApplicationForm.addEventListener('submit', submitNewApplicationForm)
if (deleteApplicationForm) deleteApplicationForm.addEventListener('submit', submitdeleteApplicationForm)
if (updateApplicationForm) updateApplicationForm.addEventListener('submit', submitUpdateApplicationForm);


if (createNewPasswordForm) createNewPasswordForm.addEventListener('submit', submitNewPasswordForm);
if (deletePasswordForm) deletePasswordForm.addEventListener('submit', submitDeletePasswordForm);
if (updatePasswordForm) updatePasswordForm.addEventListener('submit', submitUpdatePasswordForm);


function submitRegisterForm(event) {
  event.preventDefault();

  var data = {};
  var errorMessage;

  if (form.username.value) {
    data.username = form.username.value;
  } else {
    errorMessage = 'you are missing a username';
  }

  if (form.hash.value) {
    data.hash = form.hash.value;
  } else {
    errorMessage += 'you are missing a password';
  }

  if (errorMessage) {
    return displayError(errorMessage);
  }

  fetch('/register', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(function (res) {
    if (!res.ok) {
      return submitError(res);
    } else {
      submitSuccess(res);
      return window.location = '/login';
    }
  })
  .catch(submitError);
}

function submitLoginForm(event) {
  event.preventDefault();

  var data = {};
  var errorMessage;

  if (!loginForm.username.value) {
    errorMessage = 'you are missing a username';
  }

  if (!loginForm.hash.value) {
    errorMessage += 'you are missing a password';
  }

  data = {
    username: loginForm.username.value,
    hash: loginForm.hash.value
  }

  if (errorMessage) {
    return displayError(errorMessage);
  }

  fetch('/login', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(function (res) {
    if (!res.ok)  {
      return submitError(res);
    } else {
      return res.json().then(function (result) {
        localStorage.token = result.token;
        window.location = '/logged?token=' + result.token;
      });
    }
  })
  .catch(submitError);
}

// ===============================================
//
// CRUD for the applications
//
// ================================================

function submitNewApplicationForm (event) {
  event.preventDefault();

  var errorMessage = '';

  if (!createNewApplicationForm.newApplication.value) {
    errorMessage = 'add a name for the application';
  }

  if (errorMessage) {
    displayError(errorMessage)
  }

  var data = {
    newApplication: createNewApplicationForm.newApplication.value
  }

  fetch('/users/createapplication', {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.token
    },
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(function (res) {
    if (!res.ok) {
      return submitError(res);
    }
    return res.json().then(function (result) {
      window.location = '/users/applications?token=' + localStorage.token;
    })
  })
  .catch(submitError);
}

function submitdeleteApplicationForm (event) {
  event.preventDefault();
  var errorMessage = '';

  if (!deleteApplicationForm.applicationName.value) {
    errorMessage = 'Missing the application name';
  }

  if (errorMessage) {
    return displayError(errorMessage);
  }

  var data = {
    applicationName: deleteApplicationForm.applicationName.value
  }

  fetch('/users/deleteapplication', {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.token
    },
    method: 'DELETE',
    body: JSON.stringify(data)
  }).then(function (res) {
    if (!res.ok) {
      return submitError(res);
    }
    window.location = '/users/applications?token=' + localStorage.token;
    return;
  })
  .catch(submitError);
}

function submitUpdateApplicationForm (event) {
  event.preventDefault();

  var errorMessage = '';

  if (!updateApplicationForm.changeName.value) {
    errorMessage = 'Missing the application name';
  }

  if (errorMessage) {
    return displayError(errorMessage);
  }

  var data = {
    applicationName: updateApplicationForm.dataset.id,
    changeName: updateApplicationForm.changeName.value
  }


  fetch('/users/updateapplication', {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.token
    },
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(function (res) {
    if (!res.ok) {
      return submitError(res);
    }
    window.location = '/users/applications?token=' + localStorage.token;
    return;
  })
  .catch(submitError);
}



// ===============================================
//
// CRUD for the passwords
//
// ================================================


function submitNewPasswordForm (event) {
  event.preventDefault();
  var errorMessage = '';

  if (!createNewPasswordForm.username.value) {
    errorMessage = 'missing username \n';
  }

  if (!createNewPasswordForm.hash.value) {
    errorMessage += 'missing password';
  }

  if (errorMessage) {
    return displayError(errorMessage)
  }

  var appName = createNewPasswordForm.dataset.appname;

  var data = {
    appName: appName,
    username: createNewPasswordForm.username.value,
    hash: createNewPasswordForm.hash.value
  }


  fetch('/users/createpassword/' + appName, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.token
    },
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(function (res) {
    if (!res.ok) {
      return submitError(res);
    }
    window.location = '/users/applications?token=' + localStorage.token;
    return;
  })
  .catch(submitError);
}


function submitDeletePasswordForm (event) {
  event.preventDefault();
  var errorMessage = '';

  if (!deletePasswordForm.username.value) {
    errorMessage = 'missing username \n';
  }

  if (!deletePasswordForm.hash.value) {
    errorMessage += 'missing password';
  }

  if (errorMessage) {
    return displayError(errorMessage)
  }

  var data = {
    username: deletePasswordForm.username.value,
    hash: deletePasswordForm.hash.value,
  }

  var appName = deletePasswordForm.dataset.appname;
  var index = deletePasswordForm.dataset.id;

  fetch('/users/deletepassword/' + appName + '/' + index , {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.token
    },
    method: 'DELETE',
    body: JSON.stringify(data)
  }).then(function (res) {
    if (!res.ok) {
      return submitError(res);
    }
    window.location = '/users/applications?token=' + localStorage.token;
    return;
  })
  .catch(submitError);
}


function submitUpdatePasswordForm (event) {
  event.preventDefault();
  var errorMessage = '';

  if (!updatePasswordForm.username.value) {
    errorMessage = 'missing username \n';
  }

  if (!updatePasswordForm.hash.value) {
    errorMessage += 'missing password';
  }

  if (errorMessage) {
    return displayError(errorMessage)
  }

  var data = {
    username: updatePasswordForm.username.value,
    hash: updatePasswordForm.hash.value,
  }

  var appName = updatePasswordForm.dataset.appname;
  var index = updatePasswordForm.dataset.id;

  fetch('/users/updatepassword/' + appName + '/' + index , {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.token
    },
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(function (res) {
    if (!res.ok) {
      return submitError(res);
    }
    window.location = '/users/applications?token=' + localStorage.token;
    return;
  })
  .catch(submitError);
}

function submitSuccess (res) {
  if (!res.ok) return submitError(res);
  // reset form
  form.reset();
}

function submitError(res, message) {
  if (res.status >= 400 && res.status < 500)
      return res.text().then(function(message) {displayError(message)});
  if (message)
      return displayError(message);
  return displayError('There was a problem submitting your form. Please try again later.');
}


function displayError (message) {
  var displayErrorMessage = document.querySelector('#error-message');
  displayErrorMessage.textContent = message;
  displayErrorMessage.style.visibility = true;
}