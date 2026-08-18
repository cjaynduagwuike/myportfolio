(function () {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');
 
  var fields = {
    name: { el: document.getElementById('name'), err: document.getElementById('name-error') },
    email: { el: document.getElementById('email'), err: document.getElementById('email-error') },
    message: { el: document.getElementById('message'), err: document.getElementById('message-error') }
  };
 
  function clearErrors() {
    Object.keys(fields).forEach(function (key) {
      fields[key].el.removeAttribute('aria-invalid');
      fields[key].err.textContent = '';
    });
    status.textContent = '';
    status.className = 'form-status';
  }
 
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
 
  function validate() {
    var valid = true;
    var firstInvalid = null;
 
    if (!fields.name.el.value.trim()) {
      fields.name.err.textContent = 'Enter your name.';
      fields.name.el.setAttribute('aria-invalid', 'true');
      valid = false;
      firstInvalid = firstInvalid || fields.name.el;
    }
 
    if (!fields.email.el.value.trim()) {
      fields.email.err.textContent = 'Enter your email.';
      fields.email.el.setAttribute('aria-invalid', 'true');
      valid = false;
      firstInvalid = firstInvalid || fields.email.el;
    } else if (!isValidEmail(fields.email.el.value.trim())) {
      fields.email.err.textContent = 'That email address looks incomplete.';
      fields.email.el.setAttribute('aria-invalid', 'true');
      valid = false;
      firstInvalid = firstInvalid || fields.email.el;
    }
 
    if (!fields.message.el.value.trim()) {
      fields.message.err.textContent = 'Add a short message.';
      fields.message.el.setAttribute('aria-invalid', 'true');
      valid = false;
      firstInvalid = firstInvalid || fields.message.el;
    }
 
    if (firstInvalid) firstInvalid.focus();
    return valid;
  }
 
  function encode(data) {
    return Object.keys(data)
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]); })
      .join('&');
  }
 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
 
    if (!validate()) {
      status.textContent = 'Fix the fields marked below, then send again.';
      status.className = 'form-status error';
      return;
    }
 
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
 
    var payload = {
      'form-name': 'contact',
      name: fields.name.el.value.trim(),
      email: fields.email.el.value.trim(),
      message: fields.message.el.value.trim()
    };
 
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Bad response');
        form.classList.add('is-success');
        status.textContent = "Thanks — I'll be in touch.";
        status.className = 'form-status success';
      })
      .catch(function () {
        status.textContent = "That didn't send. Try again, or email me directly.";
        status.className = 'form-status error';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
      });
  });
})();
