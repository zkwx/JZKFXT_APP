<template>
  <div class="container">
    <div id="canvasBox" :style="getHorizontalStyle">
      <canvas></canvas>
      <flexbox id="tabText">
        <flexbox-item class="flexbox-item-padding">
          <h3>{{msg}}</h3>
        </flexbox-item>
        <flexbox-item class="flexbox-item-padding" :span="3">
          <x-button type="default" @click.native="clear">重新签名</x-button>
        </flexbox-item>
        <flexbox-item class="flexbox-item-padding" :span="3">
          <x-button type="primary" @click.native="upload">保存</x-button>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
import Draw from "../utils/draw";
import { XButton, Flexbox, FlexboxItem } from "vux";
export default {
  props: {
    DisabledID: Number
  },
  data() {
    return {
      msg: "请在上方空白处签名",
      degree: 90,
      signImage: null,
      showBox: false,
      successCallback: null
    };
  },
  components: {
    Draw,
    XButton,
    Flexbox,
    FlexboxItem
  },
  beforeCreate() {
    document.title = "手写签名";
  },
  mounted() {
    this.canvasBox = document.getElementById("canvasBox");
    this.initCanvas();
  },
  computed: {
    getHorizontalStyle() {
      const d = document;
      const w =
        window.innerWidth ||
        d.documentElement.clientWidth ||
        d.body.clientWidth;
      const h =
        window.innerHeight ||
        d.documentElement.clientHeight ||
        d.body.clientHeight;
      let length = (h - w) / 2;
      let width = w;
      let height = h;
      switch (this.degree) {
        case -90:
          length = -length;
        case 90:
          width = h;
          height = w;
          break;
        default:
          length = 0;
      }
      return {
        transform: `rotate(${this.degree}deg) translate(${length +
          5}px,${length - 5}px)`,
        width: `${width - 10}px`,
        height: `${height - 10}px`,
        transformOrigin: "center center"
      };
    }
  },
  methods: {
    initCanvas() {
      const canvas = document.querySelector("canvas");
      this.draw = new Draw(canvas, -this.degree);
    },
    clear() {
      this.draw.clear();
    },
    download() {
      this.draw.downloadPNGImage(this.draw.getPNGImage());
    },
    async upload() {
      const image = this.draw.getPNGImage();
      const blob = this.draw.dataURLtoBlob(image);
      const formData = new FormData();
      formData.append("fileData", blob, this.DisabledID+blob.size.toString()+".png");
      formData.append("fileType", "sign");
      formData.append("disabledID", this.DisabledID);
      this.signImage = await this.$http.post("File", formData);
      this.$emit("success");
    }
  }
};
</script>

<style>
#canvasBox {
  display: flex;
  flex-direction: column;
  height: 100%;
}
#tabText {
  user-select: none;
}
input {
  font-size: 20px;
}
canvas {
  flex: 1;
  cursor: crosshair;
  border: 2px dashed lightgray;
}
.image-box {
  width: 100%;
  height: 100%;
}
.image-box header {
  font-size: 18px;
}
.image-box img {
  max-width: 80%;
  max-height: 80%;
  margin-top: 50px;
  border: 1px solid gray;
}
.flexbox-item-padding {
  padding: 10px;
}
</style>