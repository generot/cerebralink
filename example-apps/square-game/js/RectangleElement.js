class RectangleElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        const div = document.createElement("div");
        const style = document.createElement("style");

        div.setAttribute("class", "elem-wrapper");

        let rotated = this.getAttribute("rotated") || "false";
        let period = 1 / parseInt(this.getAttribute("frequency") || "5");

        let width = rotated == "true" ? 200 : 50;
        let height = rotated == "true" ? 50 : 200;

        style.textContent = `
            .elem-wrapper {
                background-color: ${this.getAttribute("color")};
                position: absolute;
                transform: translate(${this.getAttribute("x")}vw, ${this.getAttribute("y")}vw);
                width: ${width}px;
                height: ${height}px;
                border-radius: 10px;
                animation: blink ${period}s linear infinite;
            }

            @keyframes blink {
                50% {
                    opacity: 0;
                }
            }
        `;

        shadow.append(style, div);
    }
}

customElements.define("blinking-rect", RectangleElement);