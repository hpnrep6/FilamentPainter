import { config } from "../config/Config.js";
import { updateImage } from "./UpdateImage.js";

// export function setupImageImport() {
//     const imageUpload = document.getElementById('image-upload') as HTMLInputElement;
//
//     imageUpload.addEventListener('change', function(event: Event) {
//         const input = event.target as HTMLInputElement;
//         const file = input.files?.[0]; // Use optional chaining in case files is null
//
//         if (file) {
//             const reader = new FileReader();
//
//             reader.onload = function(e) {
//                 config.paint.image.src = e.target?.result as string; // Cast result to string
//                 updateImage();
//             }
//
//             reader.readAsDataURL(file);
//         }
//     });
// }
