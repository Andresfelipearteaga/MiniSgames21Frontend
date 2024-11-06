<script setup>
defineProps({
  rowReverse: {
    type: Boolean,
    default: false,
  },
  title: {
    type: [Object, String],
    required: true,
    text: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  description: {
    type: String,
    default: "",
  },
  value: {
    type: [Object, String, Number],
    required: true,
    text: {
      type: [String, Number],
    },
    color: {
      type: String,
    },
  },
  percentage: {
    type: [Object, String],
    value: {
      type: String,
    },
    color: {
      type: String,
    },
    default: () => ({
      color: "success",
    }),
  },
  icon: {
    type: [String, Object],
    component: {
      type: String,
    },
    background: {
      type: String,
    },
    shape: {
      type: String,
    },
    default: () => ({
      background: "bg-white",
      shape: " border-radius-md",
    }),
  },
  classContent: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="mb-3 card" style="background-color: #181d2b; border: 2px solid white;">
    <div class="p-3 card-body">
      <div
        class="d-flex"
        :class="rowReverse ? '' : 'flex-row-reverse justify-content-between'"
      >
        <div
          class="text-center shadow icon icon-shape"
          :class="[
            typeof icon === 'object'
              ? `${icon.background} ${icon.shape}`
              : 'border-radius-md',
            rowReverse ? 'me-2' : '',
          ]"
        >
          <i
            class="text-lg "
            :class="typeof icon === 'string' ? icon : icon.component"
            aria-hidden="true"
          ></i>
        </div>
        <div :class="classContent">
          <div class="numbers">
            <p
              class="mb-0 text-sm text-uppercase font-weight-light" style="color: white;"
            >
              {{ typeof title === "string" ? title : title.text }}
            </p>
            <h5 :class="`mb-0 font-weight-bolder`" style="color: white;">
              {{
                (value && typeof value === "string") ||
                (value && typeof value === "number")
                  ? value
                  : value.text
              }}

            </h5>
            <!--  eslint-disable-next-line vue/no-v-html -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
