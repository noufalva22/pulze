import React, { useState, useEffect } from 'react';
import './template.scss';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ReactQuill from 'react-quill';
import CallIcon from '@mui/icons-material/Call';
import LinkIcon from '@mui/icons-material/Link';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { adminRequest, publicRequest } from '../../requestMethods';

const Template = () => {

    const [value, setValue] = useState(0);
    const [templateName, setTemplateName] = useState('');
    const [templateType, setTemplateType] = useState('');
    const [templateCategory, setTemplateCategory] = useState('');
    const [message, setMessage] = useState('');
    const [action, setAction] = useState('');
    const [file, setFile] = useState(null); // State to hold uploaded file
    const [showPreview, setShowPreview] = useState(true);
    const [otherFile, setOtherFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // State to hold image preview URL
    const [whatsappFormattedMessage, setWhatsappFormattedMessage] = useState('');
    const [callToActionType, setCallToActionType] = useState('phoneNumber'); // Default to phone number
    const [callToActionName, setCallToActionName] = useState('');
    const [callToActionValue, setCallToActionValue] = useState('');
    const [callToActionCount, setCallToActionCount] = useState(1);
    const [callToActionList, setCallToActionList] = useState([]);
    const [quickReplyList, setQuickReplyList] = useState([]);
    const [quickReplyTitle, setQuickReplyTitle] = useState('');
    const [quickReplyOptions, setQuickReplyOptions] = useState(['']); // Array to store Quick Reply options
    const [quickReplyCount, setQuickReplyCount] = useState(1);

    const [template, setTemplate] = useState('');

    const [templateList, setTemplateList] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Fetch template data from the database (replace this with your actual fetch logic)
    useEffect(() => {
        fetchTemplates(); // Function to fetch templates
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await adminRequest.get(`/orgData/tikktap/templates`, {
                withCredentials: true
            });
            console.log(res.data);
            setTemplateList(res.data.templates);
        } catch (error) {
            console.error('Error fetching templates:', error);
            // Handle error fetching templates
        }
    };

    const handleTemplateChange = (event, newValue) => {
        setTemplate(newValue);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setShowPreview(false); // Reset preview when switching tabs
    };

    const handlePreview = () => {
        // Logic to handle preview display
        setShowPreview(true);
        formatMessageForWhatsApp();
    };

    const handleAddCallToAction = () => {
        setCallToActionCount(prevCount => prevCount + 1);
        setCallToActionList(prevList => [
            ...prevList,
            {
                type: callToActionType,
                name: callToActionName,
                value: callToActionValue
            }
        ]);
        setAction('callToAction'); // Set action to 'callToAction' when adding a call to action
    };

    const handleRemoveCallToAction = (indexToRemove) => {
        const updatedList = [...callToActionList];
        updatedList.splice(indexToRemove, 1);
        setCallToActionList(updatedList);
        if (updatedList.length === 0) {
            setAction('none'); // Set action to 'none' when there are no call to actions left
        }
    };

    const handleAddQuickReply = () => {
        setQuickReplyCount(prevCount => prevCount + 1);
        setQuickReplyOptions(prevOptions => [...prevOptions, '']);
    };

    const handleRemoveQuickReply = (indexToRemove) => {
        setQuickReplyCount(prevCount => prevCount - 1);
        setQuickReplyOptions(prevOptions => prevOptions.filter((_, index) => index !== indexToRemove));
    };

    const handleQuickReplyChange = (index, value) => {
        setQuickReplyOptions(prevOptions => {
            const updatedOptions = [...prevOptions];
            updatedOptions[index] = value;
            return updatedOptions;
        });
        console.log(quickReplyOptions);
    };

    const formatMessageForWhatsApp = () => {
        let formattedMessage = message;

        // Analyze the message for bold, italic, or underline formatting
        // If bold, add * at the beginning and end of the bold text
        // Add additional logic for italic and underline formatting if needed

        // Example for bold text
        if (formattedMessage.includes('<b>') && formattedMessage.includes('</b>')) {
            formattedMessage = formattedMessage.replace(/<b>/g, '*').replace(/<\/b>/g, '*');
        }

        setWhatsappFormattedMessage(formattedMessage);
    };

    // Function to handle image file upload
    const handleImageUpload = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setImageFile(file);
            setImagePreviewUrl(reader.result); // Set image preview URL
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className='templatePage'>
            <div className='templatePage__tabsContainer'>
                <div className='templatePage__tabContent'>
                    <>
                        <div className='formContainer'>
                            <label className='formContainer__label'>Select Template</label>
                            <Autocomplete
                                value={selectedTemplate}
                                onChange={(event, newValue) => {
                                    setSelectedTemplate(newValue);
                                    // Update fields based on selected template
                                    setTemplateName(newValue.templateName || '');
                                    setTemplateType(newValue.templateType || '');
                                    setTemplateCategory(newValue.templateCategory || '');
                                    setMessage(newValue.message || '');
                                    // Update action based on template's action type
                                    setAction(newValue.action ? Object.keys(newValue.action)[0] : '');
                                    // Update call to action fields if action type is 'callToAction'
                                    if (newValue.action && Object.keys(newValue.action)[0] === 'callToAction') {
                                        const callToAction = newValue.action.callToAction;
                                        setCallToActionType(callToAction.actionType || 'phoneNumber');
                                        setCallToActionName(callToAction.actionName || '');
                                        setCallToActionValue(callToAction.actionValue || '');
                                        setCallToActionList([callToAction]);
                                    }
                                }}
                                options={templateList}
                                getOptionLabel={(option) => option.templateName || ''}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                            />
                            <label className='formContainer__label'>Template Category:</label>
                            <select
                                value={templateCategory}
                                onChange={(e) => setTemplateCategory(e.target.value)}
                                className='formContainer__select'
                            >
                                <option value=''>Select Template Category</option>
                                <option value='UTILITY'>UTILITY</option>
                                <option value='MARKETING'>MARKETING</option>
                            </select>

                            <label className='formContainer__label'>Template Name:</label>
                            <input
                                type='text'
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                className='formContainer__input'
                            />

                            <label className='formContainer__label'>Template Type:</label>
                            <select
                                value={templateType}
                                onChange={(e) => setTemplateType(e.target.value)}
                                className='formContainer__select'
                            >
                                <option value=''>Select Template Type</option>
                                <option value='Text'>Text</option>
                                <option value='Image'>Image</option>
                                <option value='Video'>Video</option>
                                <option value='File Location'>File Location</option>
                            </select>

                            {/* Add image upload input */}
                            {templateType === 'Image' && (
                                <div className='formContainer__fileInput'>
                                    <label className='formContainer__label'>Upload Image:</label>
                                    <label className='customFileInput'>
                                        Choose File
                                        <input
                                            type='file'
                                            onChange={handleImageUpload}
                                            accept='image/*'
                                        />
                                    </label>
                                </div>
                            )}

                            <label className='formContainer__label' htmlFor='message'>Message:</label>
                            <textarea
                                id='message'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className='formContainer__textarea'
                            />

                            <div className="action">
                                <label className='formContainer__label'>Action:</label>
                                <div className='formContainer__radioButtons'>
                                    <div className="radioButton">
                                        <input
                                            type='radio'
                                            id='none'
                                            value='none'
                                            checked={action === 'none'}
                                            onChange={(e) => setAction(e.target.value)}
                                        />
                                        <label htmlFor='none'>None</label>
                                    </div>
                                    <div className="radioButton">
                                        <input
                                            type='radio'
                                            id='callToAction'
                                            value='callToAction'
                                            checked={action === 'callToAction'}
                                            onClick={(e) => {
                                                if (callToActionCount === 1) {
                                                    handleAddCallToAction();
                                                }
                                            }}
                                            onChange={(e) => setAction(e.target.value)}
                                        />
                                        <label htmlFor='callToAction'>Call to Action</label>
                                    </div>
                                    <div className="radioButton">
                                        <input
                                            type='radio'
                                            id='quickReplies'
                                            value='quickReplies'
                                            checked={action === 'quickReplies'}
                                            onChange={(e) => setAction(e.target.value)}
                                        />
                                        <label htmlFor='quickReplies'>Quick Replies</label>
                                    </div>
                                </div>

                                {action === 'callToAction' && (
                                    <>
                                        {callToActionList.map((cta, index) => (
                                            <div className='formContainer__callToAction' key={index}>
                                                <button onClick={() => handleRemoveCallToAction(index)}>X</button>
                                                <div className='formContainer__inputGroup'>
                                                    <label className='formContainer__label'>Call to Action Type:</label>
                                                    <select
                                                        value={cta.type}
                                                        onChange={(e) => {
                                                            const updatedCallToActionList = [...callToActionList];
                                                            updatedCallToActionList[index].type = e.target.value;
                                                            setCallToActionList(updatedCallToActionList);
                                                        }}
                                                        className='formContainer__select'
                                                    >
                                                        <option value='phoneNumber'>Phone Number</option>
                                                        <option value='url'>URL</option>
                                                    </select>
                                                </div>
                                                <div className='formContainer__inputGroup'>
                                                    <label className='formContainer__label'>Call to Action Name:</label>
                                                    <input
                                                        type='text'
                                                        value={cta.name}
                                                        onChange={(e) => {
                                                            const updatedCallToActionList = [...callToActionList];
                                                            updatedCallToActionList[index].name = e.target.value;
                                                            setCallToActionList(updatedCallToActionList);
                                                        }}
                                                        className='formContainer__input'
                                                    />
                                                </div>
                                                <div className='formContainer__inputGroup'>
                                                    <label className='formContainer__label'>Call to Action Value:</label>
                                                    <input
                                                        type='text'
                                                        value={cta.value}
                                                        onChange={(e) => {
                                                            const updatedCallToActionList = [...callToActionList];
                                                            updatedCallToActionList[index].value = e.target.value;
                                                            setCallToActionList(updatedCallToActionList);
                                                        }}
                                                        className='formContainer__input'
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={handleAddCallToAction}>+ Add Call to Action</button>
                                    </>
                                )}

                                {action === 'quickReplies' && (
                                    <>
                                        {[...Array(quickReplyCount)].map((_, index) => (
                                            <div className='formContainer__quickReply' key={index}>
                                                <button className="formContainer__quickReplyCloseButton" onClick={() => handleRemoveQuickReply(index)}>X</button>
                                                <div className='formContainer__inputGroup'>
                                                    <label className='formContainer__label'>Quick Reply:</label>
                                                    <input
                                                        type='text'
                                                        value={quickReplyOptions[index]}
                                                        onChange={(e) => handleQuickReplyChange(index, e.target.value)}
                                                        className='formContainer__input'
                                                        placeholder='Button Title'
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={handleAddQuickReply}>+ Add Quick Reply</button>
                                    </>
                                )}

                            </div>
                            <button onClick={handlePreview} className='previewButton'>
                                Next
                            </button>
                        </div>

                        {showPreview && (
                            <div className='previewContainer'>
                                <h3 className='previewContainer__title'>Preview</h3>
                                <div className="left">
                                    {/* Add preview content here based on the selected template */}
                                    {templateType === 'Image' && (
                                        <img src={imagePreviewUrl} alt="Image Preview" className='previewImage' />
                                    )}
                                    <p className='previewContainer__info'>{message}</p>
                                    {/* Render call to action buttons */}
                                    {action === 'callToAction' && (
                                        <>
                                            {callToActionList.map((cta, index) => (
                                                <button key={index} onClick={() => {
                                                    if (cta.type === 'phoneNumber') {
                                                        window.location.href = `tel:${cta.value}`;
                                                    } else if (cta.type === 'url') {
                                                        window.open(cta.value, '_blank');
                                                    }
                                                }}>
                                                    {cta.type === 'phoneNumber' ? <CallIcon /> : null}
                                                    {cta.type === 'url' ? <LinkIcon /> : null}
                                                    {cta.name} {/* Update here to display Call to Action Name */}
                                                </button>
                                            ))}
                                        </>
                                    )}


                                    {/* Render quick reply buttons */}
                                    {action === 'quickReplies' && (
                                        <>
                                            {quickReplyOptions.map((option, index) => (
                                                <button key={index}>
                                                    {option}
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                    </>


                </div>
            </div>
        </div>
    );
};

export default Template;
