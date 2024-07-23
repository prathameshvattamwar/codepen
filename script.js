// Initialize CodeMirror editors
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlCode'), {
    mode: 'xml',
    htmlMode: true,
    theme: 'material',
    lineNumbers: true
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById('cssCode'), {
    mode: 'css',
    theme: 'material',
    lineNumbers: true
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById('jsCode'), {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true
});

// Function to run the code
function runCode() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = `<style>${cssEditor.getValue()}</style>`;
    const jsCode = `<script>${jsEditor.getValue()}<\/script>`;
    const resultFrame = document.getElementById("resultFrame").contentWindow.document;

    resultFrame.open();
    resultFrame.write(htmlCode + cssCode + jsCode);
    resultFrame.close();
}

// Function to save the code to local storage
function saveCode() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();

    localStorage.setItem("htmlCode", htmlCode);
    localStorage.setItem("cssCode", cssCode);
    localStorage.setItem("jsCode", jsCode);
}

// Function to clear the code from local storage and editors
function clearCode() {
    localStorage.removeItem("htmlCode");
    localStorage.removeItem("cssCode");
    localStorage.removeItem("jsCode");

    htmlEditor.setValue('');
    cssEditor.setValue('');
    jsEditor.setValue('');
}

// Function to load the code from local storage
function loadCode() {
    const htmlCode = localStorage.getItem("htmlCode");
    const cssCode = localStorage.getItem("cssCode");
    const jsCode = localStorage.getItem("jsCode");

    if (htmlCode) htmlEditor.setValue(htmlCode);
    if (cssCode) cssEditor.setValue(cssCode);
    if (jsCode) jsEditor.setValue(jsCode);
}

// Function to format the code
function formatCode() {
    const formattedHtml = prettier.format(htmlEditor.getValue(), {
        parser: "html",
        plugins: prettierPlugins
    });
    const formattedCss = prettier.format(cssEditor.getValue(), {
        parser: "css",
        plugins: prettierPlugins
    });
    const formattedJs = prettier.format(jsEditor.getValue(), {
        parser: "babel",
        plugins: prettierPlugins
    });

    htmlEditor.setValue(formattedHtml);
    cssEditor.setValue(formattedCss);
    jsEditor.setValue(formattedJs);
}

// Function to download the code
function downloadCode() {
    const zip = new JSZip();
    zip.file("index.html", htmlEditor.getValue());
    zip.file("styles.css", cssEditor.getValue());
    zip.file("scripts.js", jsEditor.getValue());

    zip.generateAsync({ type: "blob" }).then(function (content) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "code.zip";
        link.click();
    });
}

// Function to import code
function importCode(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const content = e.target.result;
        if (file.name.endsWith(".html")) {
            htmlEditor.setValue(content);
        } else if (file.name.endsWith(".css")) {
            cssEditor.setValue(content);
        } else if (file.name.endsWith(".js")) {
            jsEditor.setValue(content);
        }
    };

    reader.readAsText(file);
}

// Function to change theme
function changeTheme(event) {
    const theme = event.target.value;
    htmlEditor.setOption("theme", theme);
    cssEditor.setOption("theme", theme);
    jsEditor.setOption("theme", theme);
}

// Function to toggle full screen
function toggleFullScreen() {
    const resultFrame = document.getElementById("resultFrame");
    if (resultFrame.requestFullscreen) {
        resultFrame.requestFullscreen();
    } else if (resultFrame.webkitRequestFullscreen) { /* Safari */
        resultFrame.webkitRequestFullscreen();
    } else if (resultFrame.msRequestFullscreen) { /* IE11 */
        resultFrame.msRequestFullscreen();
    }
}

// Event listeners
document.getElementById("runCode").addEventListener("click", runCode);
document.getElementById("saveCode").addEventListener("click", saveCode);
document.getElementById("clearCode").addEventListener("click", clearCode);
document.getElementById("formatCode").addEventListener("click", formatCode);
document.getElementById("downloadCode").addEventListener("click", downloadCode);
document.getElementById("importCode").addEventListener("change", importCode);
document.getElementById("themeSelector").addEventListener("change", changeTheme);
document.getElementById("fullScreenToggle").addEventListener("click", toggleFullScreen);

// Load code from local storage on page load
window.onload = loadCode;

// Auto-save code every 5 seconds
setInterval(saveCode, 5000);

// Make editors resizable
$('.resizable').resizable({
    handles: 'e, s',
    minWidth: 100,
    resize: function () {
        htmlEditor.refresh();
        cssEditor.refresh();
        jsEditor.refresh();
    }
});
