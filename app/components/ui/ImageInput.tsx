import React, { ChangeEvent, useRef, useState } from 'react'
import { MdAddAPhoto } from 'react-icons/md'
import { Modal } from './modals/Modal'
import { HighlightButton } from './Button'
import { successToast } from '@/app/utils/toast'

interface ImageInputProps {
    onImageChange: (imageBase64: string | null) => void
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageChange }) => {
    const [previewSource, setPreviewSource] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            const base64 = reader.result as string
            setPreviewSource(base64)
            setIsModalOpen(true)
        }
    }
    const openFilePicker = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleModalSave = () => {
        onImageChange(previewSource) // send the image to the parent component when the save button is clicked
        successToast('Image selected successfully')
        setIsModalOpen(false)
    }

    const handleModalClose = () => {
        setIsModalOpen(false) // close the modal without sending the image to the parent component
    }
    return (
        <div className="flex flex-col justify-center items-start w-[92%] m-auto  gap-2">
            <label>Profile Image</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
            />
            <div
                className="flex items-start active:scale-95 group gap-2 justify-center w-full p-4 border border-secondaryText hover:border-primaryBlue rounded-md cursor-pointer "
                onClick={openFilePicker}
            >
                <MdAddAPhoto
                    className="group-hover:text-primaryBlue"
                    size={24}
                />
                <span className=" group-hover:text-primaryBlue">Add Image</span>
            </div>
            {fileName && <p className=" m-auto">{fileName}</p>}
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                modalTitle="Preview Image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="m-auto"
            >
                {previewSource && (
                    <img
                        src={previewSource}
                        alt="chosen"
                        className="object-contain h-[600px] rounded-md"
                    />
                )}
                <div className="flex flex-col md:flex-row gap-3 md:gap-10 w-full md:w-max m-auto">
                    <HighlightButton
                        onClick={handleModalSave}
                        type="button"
                        label={'Save'}
                        className="capitalize w-[80%] m-auto px-7 py-3 rounded-md"
                    />

                    <button
                        onClick={handleModalClose}
                        className="capitalize  w-[80%] m-auto hover:outline outline-1 px-7 py-3 rounded-md outline-red-500"
                    >
                        close
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default ImageInput
