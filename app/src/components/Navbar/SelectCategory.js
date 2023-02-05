import Select from "react-select";
import categories from "../../utils/config/categories";
import useStore from "../../store";
import "./SelectCategory.css";

const SelectCategory = () => {
  const category = useStore((state) => state.category);
  const setCategory = useStore((state) => state.setCategory);

  return (
    <Select
      className="select"
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderTopLeftRadius: "4px",
          borderBottomLeftRadius: "4px",
          borderRadius: 0,
        }),
      }}
      options={categories}
      defaultValue={{ value: -1, label: "All" }}
      value={categories.find((c) => c.value === category)}
      onChange={setCategory}
    />
  );
};

export default SelectCategory;
