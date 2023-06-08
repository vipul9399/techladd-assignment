import React, { useState } from 'react';

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({
    companyUEN: '',
    companyName: '',
    fullName: '',
    position: '',
    emailAddress: '',
    reenterEmailAddress: '',
    mobileNumber: '',
    termsAndConditions: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: checked }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    // Perform form validation
    if (activeStep === 0) {
      if (!formValues.companyUEN || !formValues.companyName) {
        alert('Please fill in all the required fields.');
        return;
      }
    } else if (activeStep === 1) {
      if (
        !formValues.fullName ||
        !formValues.position ||
        !formValues.emailAddress ||
        !formValues.reenterEmailAddress ||
        !formValues.mobileNumber
      ) {
        alert('Please fill in all the required fields.');
        return;
      }
      if (formValues.emailAddress !== formValues.reenterEmailAddress) {
        alert('The email addresses do not match.');
        return;
      }
    } else if (activeStep === 3) {
      if (!formValues.termsAndConditions) {
        alert('Please accept the terms and conditions.');
        return;
      }
    }

    // Submit the form data
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            saveForm(data: {
              companyUEN: "${formValues.companyUEN}",
              companyName: "${formValues.companyName}",
              fullName: "${formValues.fullName}",
              position: "${formValues.position}",
              emailAddress: "${formValues.emailAddress}",
              mobileNumber: "${formValues.mobileNumber}",
              termsAndConditions: ${formValues.termsAndConditions}
            })
          }
        `,
      }),
    });

    const data = await response.json();
    console.log(data.data.saveForm);

    // Reset the form values
    setFormValues({
      companyUEN: '',
      companyName: '',
      fullName: '',
      position: '',
      emailAddress: '',
      reenterEmailAddress: '',
      mobileNumber: '',
      termsAndConditions: false,
    });

    // Move to the next step
    setActiveStep((prevStep) => prevStep + 1);
  };

  const steps = [
    {
      title: 'Company Information',
      fields: [
        { name: 'companyUEN', label: 'Company UEN', required: true },
        { name: 'companyName', label: 'Company Name', required: true },
      ],
    },
    {
      title: 'Applicant Information',
      fields: [
        { name: 'fullName', label: 'Full Name', required: true },
        { name: 'position', label: 'Position with Company', required: true },
        { name: 'emailAddress', label: 'Email Address', required: true },
        { name: 'reenterEmailAddress', label: 'Re-enter Email Address', required: true },
        { name: 'mobileNumber', label: 'Mobile Number', required: true },
      ],
    },
    {
      title: 'Upload Documents',
      fields: [],
    },
    {
      title: 'Terms & Conditions',
      fields: [{ name: 'termsAndConditions', label: 'By ticking, you are confirming that you have understood and are agreeing to the details mentioned.', required: true }],
    },
  ];

  const renderFormFields = () => {
    const currentStep = steps[activeStep];

    return currentStep.fields.map((field) => (
      <div key={field.name}>
        {field.required && <span style={{ color: 'red' }}>*</span>}
        <label>{field.label}</label>
        {field.name === 'termsAndConditions' ? (
          <input
            type="checkbox"
            name={field.name}
            checked={formValues[field.name]}
            onChange={handleCheckboxChange}
          />
        ) : (
          <input
            type={field.name.includes('email') ? 'email' : 'text'}
            name={field.name}
            value={formValues[field.name]}
            onChange={handleInputChange}
          />
        )}
      </div>
    ));
  };

  return (
    <div>
      <h1>Form</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%' }}>
          <ul>
            {steps.map((step, index) => (
              <li
                key={index}
                style={{ fontWeight: index === activeStep ? 'bold' : 'normal', marginBottom: '10px' }}
              >
                {step.title}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: '70%' }}>
          <div>
            {renderFormFields()}
            <div>
              {activeStep > 0 && (
                <button type="button" onClick={handleBack}>
                  Back
                </button>
              )}
              {activeStep < steps.length - 1 ? (
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              ) : (
                <button type="button" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
