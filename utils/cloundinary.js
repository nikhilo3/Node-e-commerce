import cloudinary from 'cloudinary'

cloudinary.config({
    cloud_name: 'dzqbmniu3',
    api_key: '239823815664278',
    api_secret: 'tKhMl36ZnlAyi4hLagcl4eV-Sl4' // Click 'View Credentials' below to copy your API secret
});


const cloundinaryUploadImg = async (fileToUpload) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpload, (result) => {
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,

                },
                { resource_type: "auto" }
            )
        })
    })
}


const cloundinarydeleteImg = async (fileTodelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileTodelete, (result) => {
            resolve(
                {
                    url: result.secure_url,
                    asset_id: result.asset_id,
                    public_id: result.public_id,

                },
                { resource_type: "auto" }
            )
        })
    })
}


export { cloundinaryUploadImg,cloundinarydeleteImg }