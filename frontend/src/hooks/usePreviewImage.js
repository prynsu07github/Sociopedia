import { useState } from "react"
import useShowToast from "./useShowToast"
const usePreviewImage = () => {
    const showToast = useShowToast()
    const [imageUrl , setImageUrl] = useState("")
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file && file.type.startsWith('image/')){
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                setImageUrl(reader.result)
            }
            // console.log(imageUrl);
        }else{
            showToast('Inavlid file type' , 'error')
        }
    }
    return {handleImageChange , imageUrl, setImageUrl}
}

export default usePreviewImage