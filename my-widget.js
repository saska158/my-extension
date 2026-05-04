class MyWidget extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="
        padding:20px;
        border:1px solid #ccc;
        border-radius:8px;
        font-family:sans-serif;
      ">
        My custom extension
      </div>
    `
  }
}

customElements.define("my-widget", MyWidget)