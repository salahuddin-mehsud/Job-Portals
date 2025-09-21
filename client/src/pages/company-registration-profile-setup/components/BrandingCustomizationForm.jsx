import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const BrandingCustomizationForm = ({
  formData,
  handleFileChange,
  handleNestedChange,
  handleCaptionChange,
  removePhoto,
  fileInputRef,
  errors, setFormData
}) => {
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);

  const handleDragOver = (e, setDragging) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e, setDragging) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e, field, setDragging) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (field === 'logo') {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          const event = { target: { files: [file] } };
          handleFileChange(event, field);
        }
      } else if (field === 'culturePhotos') {
        Array.from(files).forEach((file) => {
          if (file.type.startsWith('image/')) {
            const event = { target: { files: [file] } };
            handleFileChange(event, field);
          }
        });
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Branding & Customization</h2>
        <p className="text-text-secondary">
          Customize your company profile with visual elements to attract top talent.
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Company Logo */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Company Logo
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`border-2 ${
              isDraggingLogo ? 'border-primary bg-primary-50' : 'border-dashed border-border'} rounded-lg p-6 flex flex-col items-center justify-center transition-smooth`
              }
              onDragOver={(e) => handleDragOver(e, setIsDraggingLogo)}
              onDragLeave={(e) => handleDragLeave(e, setIsDraggingLogo)}
              onDrop={(e) => handleDrop(e, 'logo', setIsDraggingLogo)}>

              <Icon name="Image" size={32} className="text-secondary-400 mb-4" />
              <div className="text-center">
                <p className="text-sm text-text-secondary mb-2">
                  Drag and drop your logo here, or
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-text-primary bg-background hover:bg-surface transition-smooth">

                  <Icon name="Upload" size={16} className="mr-2" />
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'logo')} />

                <p className="mt-2 text-xs text-text-secondary">
                  Recommended: Square image, at least 400x400px, PNG or JPG
                </p>
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm font-medium text-text-primary mb-2">Preview</p>
              <div className="flex-1 bg-surface rounded-lg border border-border flex items-center justify-center p-4">
                {formData.logoPreview ?
                <div className="relative">
                    <div className="w-32 h-32 overflow-hidden rounded-lg">
                      <Image
                      src={formData.logoPreview}
                      alt="Company logo preview"
                      className="w-full h-full object-contain" />

                    </div>
                    <button
                    type="button"
                    onClick={() => {
                      setFormData((prevData) => ({
                        ...prevData,
                        logo: null,
                        logoPreview: ''
                      }));
                    }}
                    className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 hover:bg-error-600 transition-smooth">

                      <Icon name="X" size={14} />
                    </button>
                  </div> :

                <div className="text-center text-text-secondary">
                    <Icon name="Image" size={48} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Logo preview will appear here</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        
        {/* Company Culture Photos */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Company Culture Photos
          </label>
          
          <div
            className={`border-2 ${
            isDraggingPhotos ? 'border-primary bg-primary-50' : 'border-dashed border-border'} rounded-lg p-6 flex flex-col items-center justify-center transition-smooth mb-4`
            }
            onDragOver={(e) => handleDragOver(e, setIsDraggingPhotos)}
            onDragLeave={(e) => handleDragLeave(e, setIsDraggingPhotos)}
            onDrop={(e) => handleDrop(e, 'culturePhotos', setIsDraggingPhotos)}>

            <Icon name="Images" size={32} className="text-secondary-400 mb-4" />
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-2">
                Drag and drop photos that showcase your company culture, or
              </p>
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.multiple = true;
                  input.onchange = (e) => handleFileChange(e, 'culturePhotos');
                  input.click();
                }}
                className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-text-primary bg-background hover:bg-surface transition-smooth">

                <Icon name="Upload" size={16} className="mr-2" />
                Browse Files
              </button>
              <p className="mt-2 text-xs text-text-secondary">
                You can upload up to 10 photos. Recommended: 16:9 ratio, at least 1200x675px
              </p>
            </div>
          </div>
          
          {/* Photo Gallery */}
          {formData.culturePhotos.length > 0 &&
          <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-primary">Uploaded Photos</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.culturePhotos.map((photo, index) =>
              <div key={index} className="border border-border rounded-lg overflow-hidden bg-surface">
                    <div className="relative h-40">
                      <Image
                    src={URL.createObjectURL(photo)}
                    alt={`Company culture photo ${index + 1}`}
                    className="w-full h-full object-cover" />

                      <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-background text-error rounded-full p-1 hover:bg-error hover:text-white transition-smooth">

                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                    <div className="p-3">
                      <input
                    type="text"
                    placeholder="Add a caption..."
                    value={formData.culturePhotosCaptions[index] || ''}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="w-full text-sm border border-border rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />

                    </div>
                  </div>
              )}
              </div>
            </div>
          }
        </div>
        
        {/* Brand Colors */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Brand Colors (Optional)
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="primaryColor" className="block text-sm text-text-secondary mb-1">
                Primary Color
              </label>
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-md mr-3 border border-border"
                  style={{ backgroundColor: formData.colors.primary }}>
                </div>
                <input
                  type="text"
                  id="primaryColor"
                  value={formData.colors.primary}
                  onChange={(e) => handleNestedChange('colors', 'primary', e.target.value)}
                  className="input-field"
                  placeholder="#2563EB" />

              </div>
            </div>
            
            <div>
              <label htmlFor="secondaryColor" className="block text-sm text-text-secondary mb-1">
                Secondary Color
              </label>
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-md mr-3 border border-border"
                  style={{ backgroundColor: formData.colors.secondary }}>
                </div>
                <input
                  type="text"
                  id="secondaryColor"
                  value={formData.colors.secondary}
                  onChange={(e) => handleNestedChange('colors', 'secondary', e.target.value)}
                  className="input-field"
                  placeholder="#64748B" />

              </div>
            </div>
          </div>
          
          <p className="mt-2 text-xs text-text-secondary">
            These colors will be used to customize your company profile page and job listings.
          </p>
        </div>
        
        {/* Branding Tips */}
        <div className="bg-surface-100 rounded-lg p-4 border border-border-light">
          <h3 className="text-sm font-medium text-text-primary mb-2 flex items-center">
            <Icon name="Lightbulb" size={16} className="mr-2 text-warning" />
            Branding Tips
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start">
              <Icon name="Check" size={14} className="mt-1 mr-2 text-accent" />
              <span>Use high-quality, professional images that represent your company culture</span>
            </li>
            <li className="flex items-start">
              <Icon name="Check" size={14} className="mt-1 mr-2 text-accent" />
              <span>Choose colors that match your company's brand identity</span>
            </li>
            <li className="flex items-start">
              <Icon name="Check" size={14} className="mt-1 mr-2 text-accent" />
              <span>Add descriptive captions to help candidates understand your workplace</span>
            </li>
            <li className="flex items-start">
              <Icon name="Check" size={14} className="mt-1 mr-2 text-accent" />
              <span>Showcase diversity and inclusion in your company photos</span>
            </li>
          </ul>
        </div>
      </div>
    </div>);

};

export default BrandingCustomizationForm;