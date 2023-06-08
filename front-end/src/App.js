import React, { useState } from 'react';
import './App.css';

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
    uploadedFiles: [], // Added state for uploaded files
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: checked }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormValues((prevValues) => ({ ...prevValues, uploadedFiles: files }));
  };

  const handleNext = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
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
              termsAndConditions: ${formValues.termsAndConditions},
              uploadedFiles: "${formValues.uploadedFiles}"
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
      uploadedFiles: [],
    });

    // Move to the next step
    setActiveStep((prevStep) => prevStep + 1);
  };

  const validateForm = () => {
    const errors = {};

    if (activeStep === 0) {
      if (!formValues.companyUEN) {
        errors.companyUEN = 'Please enter Company UEN.';
      }
      if (!formValues.companyName) {
        errors.companyName = 'Please enter Company Name.';
      }
    } else if (activeStep === 1) {
      if (!formValues.fullName) {
        errors.fullName = 'Please enter Full Name.';
      }
      if (!formValues.position) {
        errors.position = 'Please enter Position with Company.';
      }
      if (!formValues.emailAddress) {
        errors.emailAddress = 'Please enter Email Address.';
      }
      if (!formValues.reenterEmailAddress) {
        errors.reenterEmailAddress = 'Please re-enter Email Address.';
      } else if (formValues.emailAddress !== formValues.reenterEmailAddress) {
        errors.reenterEmailAddress = 'The email addresses do not match.';
      }
      if (!formValues.mobileNumber) {
        errors.mobileNumber = 'Please enter Mobile Number.';
      }
    } else if (activeStep === 3) {
      if (!formValues.termsAndConditions) {
        errors.termsAndConditions = 'Please accept the terms and conditions.';
      }
    }

    return errors;
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
      fields: [{ name: 'uploadedFiles', label: 'Upload Files', required: true }], // Added field for file upload
    },
    {
      title: 'Terms & Conditions',
      fields: [
        {
          name: 'termsAndConditions',
          label:
            'By ticking, you are confirming that you have understood and are agreeing to the details mentioned.',
          required: true,
        },
      ],
    },
  ];

  const renderFormFields = () => {
    const currentStep = steps[activeStep];

    return currentStep.fields.map((field, index) => (
      <div key={field.name} className="form-field" style={{ display: 'grid' }}>
        <label style={{ fontWeight: 'bold' }}>
          {field.required && <span className="required">*</span>}
          {field.label}
        </label>
        {field.name === 'termsAndConditions' ? (
          <input
            type="checkbox"
            name={field.name}
            checked={formValues[field.name]}
            onChange={handleCheckboxChange}
          />
        ) : field.name === 'uploadedFiles' ? ( // Added field for file upload
        <>
          <input
            type="file"
            name={field.name}
            multiple
            onChange={handleFileUpload}
            style={{
              borderColor: formErrors[field.name] && 'red', // Highlight the border if there is an error
            }}
          />
          <span>PDFs (not scanned copies) of company's operating bank current account(s) statements for the past 6 months.
Example: If today is 07 Jun 23, then please upload bank statements from Dec 22 to May 23 (both months inclusive)
If your company is multi-banked, then please upload 6 months bank statements for each bank account
If your file is password protected, we request you to remove the password and upload the file to avoid submission failure
In case if you are facing any issue while uploading bank statements, Please contact us on support@credilinq.ai</span>
          </>
        ) : (
          <>
            <input
              type={field.name.includes('email') ? 'email' : 'text'}
              name={field.name}
              style={{
                padding: '5px',
                border: `1px solid ${index < activeStep ? 'green' : '#ccc'}`,
                borderRadius: '4px',
                borderColor: formErrors[field.name] && 'red', // Highlight the border if there is an error
              }}
              value={formValues[field.name]}
              onChange={handleInputChange}
            />
            {formErrors[field.name] && (
              <p style={{ color: 'red', margin: '5px 0 0 0' }}>{formErrors[field.name]}</p>
            )}
          </>
        )}
      </div>
    ));
  };

  return (
    <div className="form-container">
      <h1>Form</h1>
      <div className="form-steps">
        <div className="step-titles">
          <ul>
            {steps.map((step, index) => (
              <li key={index} className={index === activeStep ? 'active' : index < activeStep ? 'completed' : ''}>
                {step.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="step-content">
          <div className="form-fields">{renderFormFields()}</div>
          <div className="form-buttons">
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
  );
}

export default App;
