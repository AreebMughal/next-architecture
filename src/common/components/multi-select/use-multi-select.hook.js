'use client';

import { useEffect, useState, useRef } from 'react';

export default function useMultiSelect(options, handleChange, defaultOptions, search) {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !event.target.classList.contains('noCloseOptions')
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [ref]);

  useEffect(() => {
    if (defaultOptions) {
      setSelectedOptions(defaultOptions);
    }
  }, [defaultOptions]);

  const selectedOptionsSetter = (options) => {
    setSelectedOptions(options);
    handleChange(options);
  };
  const toggleDropDown = () => {
    setOpen(!open);
  };

  const getPlaceholder = (placeholder) => {
    return selectedOptions.length > 0 ? '' : placeholder;
  };

  const isSelectedClass = (option) => {
    if (selectedOptions.find((o) => o.value === option.value)) {
      return 'border-l-[3px] border-l-teal-600 bg-teal-100';
    }
    return '';
  };

  const optionClickHandler = (option) => {
    // this will toggle option selection
    let selectedItems = [...selectedOptions, option];
    if (selectedOptions.find((o) => o.value === option.value)) {
      selectedItems = selectedOptions.filter((o) => o.value !== option.value);
    }
    selectedOptionsSetter(selectedItems);
  };

  const removeOptionHandler = (option) => {
    selectedOptionsSetter(selectedOptions.filter((o) => o.value !== option.value));
  };

  const clearAllClickHandler = () => {
    selectedOptionsSetter([]);
  };

  const handleInputChangeHandler = (e) => {
    if (search) {
      if (!open) setOpen(true);
      let newFilteredOptions = [];
      if (e.target.value.trim() !== '') {
        newFilteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(e.target.value.toLowerCase().trim())
        );
      }
      setFilteredOptions(newFilteredOptions);
    }
  };

  return {
    open,
    selectedOptions,
    filteredOptions,
    ref,
    toggleDropDown,
    getPlaceholder,
    isSelectedClass,
    optionClickHandler,
    removeOptionHandler,
    clearAllClickHandler,
    handleInputChangeHandler
  };
}
