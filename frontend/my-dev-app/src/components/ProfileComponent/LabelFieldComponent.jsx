import React from 'react'

const LabelFieldComponent = ({ label, value, placeholder, isEditing, onChange, type='text' }) => {
    return (
        <div className="flex flex-col space-y-1 items-start w-full">
            <label className="text-lg font-medium text-gray-700">{label}</label>

            {isEditing ? (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-300 text-black placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            ) : (
                <div className="w-full bg-gray-100  px-4 py-2 text-gray-500 rounded-md flex items-start">
                    {value ? value : <span className="text-gray-500">Chưa có thông tin</span>}
                </div>
            )}

        </div>
    )
}

export default LabelFieldComponent
