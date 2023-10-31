import {
  artistNameStartForm,
  artistTypeStartForm,
  itemTypeStartForm,
} from "./MusicStartForm.tsx";

export default {
  assistantForms: [
    itemTypeStartForm(),
    artistTypeStartForm(),
    artistNameStartForm(),
    {
      formKey: "artistDetailsForm",
      formFields: [],
      FormFooter: () => <div>todo</div>,
    },
  ],
};
