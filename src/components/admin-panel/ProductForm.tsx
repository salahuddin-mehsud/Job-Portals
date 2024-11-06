'use client';

import { setLoading } from "@/redux/features/loadingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { makeToast } from "@/utils/helper";
import { UploadButton } from "@/utils/uploadthing";
import axios from "axios";
import Image from "next/image";
import { FormEvent, useState } from "react";

interface IPayload {
    imgSrc: string | null;
    fileKey: string | null;
    name: string;
    category: string;
    price: string;
}

function ProductForm() {
    const [payload, setPayload] = useState<IPayload>({
        imgSrc: null,
        fileKey: null,
        name: "",
        category: "",
        price: ""
    });

    const dispatch = useAppDispatch();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            await axios.post("/api/add_product", payload);
            makeToast("Product added successfully");

            // Reset the form payload after successful submission
            setPayload({
                imgSrc: null,
                fileKey: null,
                name: "",
                category: "",
                price: ""
            });
        } catch (error) {
            console.error("Error adding product:", error);
            makeToast("Failed to add product");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Display the image only if imgSrc has a valid value or use a placeholder */}
            {payload.imgSrc ? (
                <Image 
                    className="max-h-[300px] w-auto object-contain rounded-md" 
                    src={payload.imgSrc} 
                    width={800} 
                    height={500} 
                    alt="product-image" 
                />
            ) : (
                <Image 
                    className="max-h-[300px] w-auto object-contain rounded-md" 
                    src="/logo.png" 
                    width={800} 
                    height={500} 
                    alt="product-placeholder" 
                />
            )}

            {/* Upload button with handlers */}
            <UploadButton 
                endpoint="imageUploader" 
                onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                        setPayload({
                            ...payload,
                            imgSrc: res[0].url || null,
                            fileKey: res[0].key || null
                        });
                    }
                }} 
                onUploadError={(error: Error) => {
                    console.error("Upload error:", error);
                    makeToast("Image upload failed");
                }} 
            />

            {/* Product Name Field */}
            <div>
                <label className="block ml-1">Product Name</label>
                <input 
                    className="bg-gray-300 w-full px-4 py-2 border outline-pink rounded-md" 
                    value={payload.name} 
                    onChange={(e) => setPayload({ ...payload, name: e.target.value })} 
                    required 
                    type="text" 
                />
            </div>

            {/* Product Category Field */}
            <div>
                <label className="block ml-1">Product Category</label>
                <input 
                    className="bg-gray-300 w-full px-4 py-2 border outline-pink rounded-md" 
                    value={payload.category} 
                    onChange={(e) => setPayload({ ...payload, category: e.target.value })} 
                    required 
                    type="text" 
                />
            </div>

            {/* Product Price Field */}
            <div>
                <label className="block ml-1">Product Price</label>
                <input 
                    className="bg-gray-300 w-full px-4 py-2 border outline-pink rounded-md" 
                    value={payload.price} 
                    onChange={(e) => setPayload({ ...payload, price: e.target.value })} 
                    required 
                    type="text" 
                />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <button 
                    className="bg-pink text-white px-8 py-2 rounded-md" 
                    type="submit"
                >
                    Add
                </button>
            </div>
        </form>
    );
}

export default ProductForm;
