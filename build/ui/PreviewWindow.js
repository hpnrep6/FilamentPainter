const previewWindow = document.querySelector(".preview-window");
const resizeHandle = document.querySelector(".resize-handle");
export function setupPreviewWindow() {
    if (previewWindow && resizeHandle) {
        let isResizing = false;
        let startX;
        let startWidth;
        resizeHandle.addEventListener("mousedown", (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = previewWindow.offsetWidth;
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            e.preventDefault();
        });
        function handleMouseMove(e) {
            if (!isResizing)
                return;
            let newWidth = startWidth + (e.clientX - startX);
            if (newWidth <= 200) {
                newWidth = 200;
            }
            previewWindow.style.width = `calc(${newWidth}px - 4rem)`;
            resizeHandle.style.right = "0px";
        }
        function handleMouseUp() {
            isResizing = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        previewWindow.style.width = `30vw`;
        window.addEventListener("resize", () => {
            previewWindow.style.width = `30vw`;
        });
    }
}
