import React, { useState } from 'react';
import './campaign.scss';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ReactQuill from 'react-quill';
const Campaign = () => {
    const [value, setValue] = useState(0);
    const [templateName, setTemplateName] = useState('');
    const [templateType, setTemplateType] = useState('');
    const [message, setMessage] = useState('');
    const [action, setAction] = useState('');
    const [file, setFile] = useState(null); // State to hold uploaded file
    const [showPreview, setShowPreview] = useState(true);
    const [otherFile, setOtherFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [whatsappFormattedMessage, setWhatsappFormattedMessage] = useState('');
    const [callToActionType, setCallToActionType] = useState('phoneNumber'); // Default to phone number
    const [callToActionName, setCallToActionName] = useState('');
    const [callToActionValue, setCallToActionValue] = useState('');
    const [callToActionCount, setCallToActionCount] = useState(1);
    const [callToActionList, setCallToActionList] = useState([]);
    const [quickReplyTitle, setQuickReplyTitle] = useState('');
    const [quickReplyOptions, setQuickReplyOptions] = useState(['']); // Array to store Quick Reply options
    const [quickReplyCount, setQuickReplyCount] = useState(1);
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
    };

    const handleRemoveCallToAction = (indexToRemove) => {
        setCallToActionList(prevList => prevList.filter((_, index) => index !== indexToRemove));
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

    return (
        <div className='campaignPage'>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Template" />
                    <Tab label="Contact" />
                    <Tab label="Campaign" />
                </Tabs>
            </Box>
            <div className='campaignPage__tabsContainer'>
                <div className='campaignPage__tabContent'>
                    {value === 0 && (
                        <>
                            <div className='formContainer'>
                                <label className='formContainer__label'>Template Name:</label>
                                <input
                                    type='text'
                                    id='templateName'
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    className='formContainer__input'
                                />
                                <label className='formContainer__label' >Template Type:</label>
                                <select
                                    id='templateType'
                                    value={templateType}
                                    onChange={(e) => setTemplateType(e.target.value)}
                                    className='formContainer__select'
                                >
                                    <option value=''>Select Template Type</option>
                                    <option value='TEXT'>Text</option>
                                    <option value='IMAGE'>Image</option>
                                    <option value='VIDEO'>Video</option>
                                    <option value='FILE_LOCATION'>File Location</option>
                                </select>
                                {templateType === 'IMAGE' && ( // Render file upload input if template type is IMAGE
                                    <div className='formContainer__fileInput'>
                                        <label className='formContainer__label'>Upload Image:</label>
                                        <label className='customFileInput'>
                                            Choose File
                                            <input
                                                type='file'
                                                onChange={(e) => setImageFile(e.target.files[0])}
                                                accept='image/*'
                                            />
                                        </label>
                                        {file && ( // Display file details if file is uploaded
                                            <p className='previewContainer__info'>File: {file.name}</p>
                                        )}
                                    </div>
                                )}
                                {templateType === 'VIDEO' && ( // Render file upload input if template type is VIDEO
                                    <div className='formContainer__fileInput'>
                                        <label className='formContainer__label'>Upload Video:</label>
                                        <label className='customFileInput'>
                                            Choose File
                                            <input
                                                type='file'
                                                onChange={(e) => setVideoFile(e.target.files[0])}
                                                accept='video/*'
                                            />
                                        </label>
                                        {videoFile && ( // Display file details if file is uploaded
                                            <p className='previewContainer__info'>Video: {videoFile.name}</p>
                                        )}
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
                                {/* Action */}
                                <div className="action">


                                    <label className='formContainer__label' htmlFor='action'>Action:</label>

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
                                                    if (callToActionCount == 1) {

                                                        handleAddCallToAction()
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
                                                    {/* Close button to remove the "Call to Action" section */}
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
                                            {/* Button to add a new "Call to Action" section */}
                                            <button onClick={handleAddCallToAction}>+ Add Call to Action</button>
                                        </>
                                    )}

                                    {action === 'quickReplies' && (
                                        <>
                                            {/* Existing Quick Reply Options */}
                                            {[...Array(quickReplyCount)].map((_, index) => (
                                                <div className='formContainer__quickReply' key={index}>
                                                    {/* Close button to remove the Quick Reply section */}
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
                                            {/* Button to add a new Quick Reply section */}
                                            <button onClick={handleAddQuickReply}>+ Add Quick Reply</button>

                                            {/* Additional Options */}
                                            {/* <div className='formContainer__additionalOptions'>
                                                <div className='formContainer__inputGroup'>
                                                    <label className='formContainer__label'>Quick Reply Title:</label>
                                                    <input
                                                        type='text'
                                                        value={quickReplyTitle}
                                                        onChange={(e) => setQuickReplyTitle(e.target.value)}
                                                        className='formContainer__input'
                                                    />
                                                </div>
                                                <button onClick={handleAddQuickReply}>+ Add Quick Reply</button>
                                            </div> */}
                                        </>
                                    )}




                                    {/* <button onClick={handleAddCallToAction}>+ Add Call to Action</button> */}
                                </div>
                                <button onClick={handlePreview} className='previewButton'>
                                    Next
                                </button>
                            </div>
                            {showPreview && (
                                <div className='previewContainer'>
                                    <h3 className='previewContainer__title'>Preview</h3>
                                    <div className="left">

                                        {templateType === 'IMAGE' && imageFile && (
                                            <img src={URL.createObjectURL(imageFile)} alt='Selected Image' className='previewContainer__previewImage' />
                                        )}
                                        {templateType === 'VIDEO' && videoFile && (
                                            <video controls className='previewContainer__previewVideo'>
                                                <source src={URL.createObjectURL(videoFile)} type='video/mp4' />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}

                                        <p className='previewContainer__info'>{message}</p>
                                        {/* <p className='previewContainer__info'>{whatsappFormattedMessage}</p> */}
                                        <p className='previewContainer__info'>Action: {action}</p>
                                    </div>
                                </div>
                            )}

                        </>
                    )}
                    {value === 1 && (
                        <>
                            {/* Contact tab content */}
                            <div>Contact Tab Content</div>
                            <button onClick={handlePreview} className='previewButton'>
                                Next
                            </button>
                        </>
                    )}
                    {value === 2 && (
                        <>
                            {/* Campaign tab content */}
                            <div>Campaign Tab Content</div>
                            <button onClick={handlePreview} className='previewButton'>
                                Submit
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Campaign;
