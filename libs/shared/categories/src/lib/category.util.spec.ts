import { CategoryType } from './category-type';
import { addAllCategory, checkCategoryValue, checkNumericEnum, containsCategory, countCategories, createSystemCategory, getCategoryAbbreviation, getCategoryDescription, getCategoryField, getCategoryFullName, getCategoryIcon, getCategoryName, getCategoryNumberField, getCategoryStringField, isSystemCategory, isUndefinedCategory, newCategoryAll, newCategoryUndefined, readCategory } from './category.util';

/* ------------------------ read category ------------------------ */
describe('readCategory', () => {
  const categories = [
    { id: 1, name: 'Category 1', abbreviation: 'C1', i18nBase: 'Category 1', icon: 'icon1' },
    { id: 2, name: 'Category 2', abbreviation: 'C2', i18nBase: 'Category 2', icon: 'icon2' },
    { id: 3, name: 'Category 3', abbreviation: 'C3', i18nBase: 'Category 3', icon: 'icon3' }
  ];

  it('should return the "All" category for CategoryType.All', () => {
    const result = readCategory(categories, CategoryType.All);
    expect(result.name).toEqual('general.category.all.label');
  });

  it('should return the "Undefined" category for CategoryType.Undefined', () => {
    const result = readCategory(categories, CategoryType.Undefined);
    expect(result.name).toEqual('general.category.undefined.label');
  });

  it('should return the category with the specified ID', () => {
    const result = readCategory(categories, 2);
    expect(result.name).toEqual('Category 2');
  });

  it('should return the "All" category for unknown IDs', () => {
    const result = readCategory(categories, 999);
    expect(result.name).toEqual('general.category.all.label');
  });
});

  /* ------------------------ createCategory() ------------------------ */
describe('createCategory', () => {
  it('should return a new "All" category for CategoryType.All', () => {
    const result = createSystemCategory(CategoryType.All);
    expect(result.id).toEqual(-1);
    expect(result.name).toEqual('All');
  });

  it('should return a new "Undefined" category for CategoryType.Undefined', () => {
    const result = createSystemCategory(CategoryType.Undefined);
    expect(result.id).toEqual(-3);
    expect(result.name).toEqual('Undefined');
  });
});

  /* ------------------------ newCategoryAll ------------------------ */
describe('newCategoryAll', () => {
  it('should return a new Category object for "All"', () => {
    const result = newCategoryAll();
    expect(result.id).toEqual(CategoryType.All);
    expect(result.abbreviation).toEqual('ALL');
    expect(result.name).toEqual('all');
    expect(result.i18nBase).toEqual('general.category.all');
    expect(result.icon).toEqual('radio-button-on-outline');
  });
});

  /* ------------------------ addAllCategory ------------------------ */
describe('addAllCategory', () => {
  const categories = [
    { id: 1, name: 'Category 1', abbreviation: 'C1', i18nBase: 'Category 1', icon: 'icon1' },
    { id: 2, name: 'Category 2', abbreviation: 'C2', i18nBase: 'Category 2', icon: 'icon2' },
  ];

  it('should add a new "All" category to the array', () => {
    const result = addAllCategory(categories);
    expect(result).toContainEqual(expect.objectContaining({ id: expect.any(Number), name: 'All' }));
    expect(result.length).toEqual(3);
  });
});

  /* ------------------------ newCategoryUndefined ------------------------ */
describe('newCategoryUndefined', () => {
  it('should return a new Category object for "Undefined"', () => {
    const result = newCategoryUndefined();
    expect(result.id).toEqual(CategoryType.Undefined);
    expect(result.abbreviation).toEqual('UNDEF');
    expect(result.name).toEqual('undefined');
    expect(result.i18nBase).toEqual('general.category.undefined');
    expect(result.icon).toEqual('help-circle-outline');
  });
});

  /* ------------------------ isSystemCategory ------------------------ */
  describe('isSystemCategory', () => {
    it('should return true for system categories (id < 0 or id >= CategoryType.All)', () => {
        expect(isSystemCategory(newCategoryUndefined())).toEqual(true);
        expect(isSystemCategory(newCategoryAll())).toEqual(true);
    });
  });
  
    /* ------------------------ isUndefinedCategory ------------------------ */
  describe('isUndefinedCategory', () => {
    it('should return true for category ID -1', () => {
      expect(isUndefinedCategory(-1)).toBeTruthy();
      expect(isUndefinedCategory(1)).toBeFalsy();
    });
  });
  
  /* ------------------------ containsCategory ------------------------ */
  describe('containsCategory', () => {
    const categories = [
      { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'C1', i18nBase: 'Category 1', icon: 'icon1' },
    ];
  
    it('should return true if the array contains a category with the specified ID', () => {
      expect(containsCategory(categories, CategoryType.Undefined)).toBeTruthy();
      expect(containsCategory(categories, CategoryType.All)).toBeFalsy();
    });
  });
  
  /* ------------------------ countCategories ------------------------ */
  describe('countCategories', () => {
    it('should return the number of items in the array', () => {
      const categories = [
        { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'C1', i18nBase: 'Category 1', icon: 'icon1' },
        { id: 3, name: 'Category 3', abbreviation: 'C3', i18nBase: 'Category 3', icon: 'icon3' }
      ];
  
      expect(countCategories(categories)).toEqual(2);
    });
  });
    
/* ------------------------ getCategoryFieldf ------------------------ */
  describe('getCategoryField', () => {
    const categories = [
      { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'UNDEF', i18nBase: '', icon: 'help-circle-outline' },
    ];
  
    it('should return the value of the specified field for the specified category', () => {
      expect(getCategoryField(categories, CategoryType.Undefined, 'name')).toEqual('Undefined');
    });
  });
  
/* ------------------------ getCategoryStringField ------------------------ */
  describe('getCategoryStringField', () => {
    const categories = [
      { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'UNDEF', i18nBase: '', icon: 'help-circle-outline' }
    ];
  
    it('should return the value of the specified string field for the specified category', () => {
      expect(getCategoryStringField(categories, CategoryType.Undefined, 'name')).toEqual('Undefined');
    });
  });
  
/* ------------------------ getCategoryNumberField ------------------------ */
  describe('getCategoryNumberField', () => {
    const categories = [
      { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'UNDEF', i18nBase: '', icon: 'help-circle-outline' }
    ];
  
    it('should return the value of the specified number field for the specified category', () => {
      expect(getCategoryNumberField(categories, CategoryType.Undefined, 'id')).toEqual(CategoryType.Undefined);
    });
  });
  
/* ------------------------ getCategoryFullName ------------------------ */
  describe('getCategoryFullName', () => {
    const categories = [
      { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'UNDEF', i18nBase: '', icon: 'help-circle-outline' }
    ];
  
    it('should return the abbreviation and name of the specified category', () => {
      expect(getCategoryFullName(categories, CategoryType.Undefined)).toEqual('UNDEF: Undefined');
    });
  });
  
/* ------------------------ getCategoryName ------------------------ */
  describe('getCategoryName', () => {
    const categories = [
      { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'UNDEF', i18nBase: '', icon: 'help-circle-outline' }
    ];
  
    it('should return the name of the specified category', () => {
      expect(getCategoryName(categories, CategoryType.Undefined)).toEqual('Undefined');
    });
  });
  
/* ------------------------ getCategoryAbbreviation ------------------------ */
  describe('getCategoryAbbreviation', () => {
    const categories = [
      { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'UNDEF', i18nBase: '', icon: 'help-circle-outline' }
  ];
  
    it('should return the translated abbreviation of the specified category', () => {
      expect(getCategoryAbbreviation(categories, CategoryType.Undefined)).toEqual('UNDEF');
    });
  });
  
/* ------------------------ getCategoryDescription ------------------------ */
  describe('getCategoryDescription', () => {
    const categories = [
      { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'UNDEF', i18nBase: 'This category is undefined', icon: 'help-circle-outline' }
    ];
  
    it('should return the translated description of the specified category', () => {
      expect(getCategoryDescription(categories, CategoryType.Undefined)).toEqual('general.category.undefined.description');
    });
  });
  
/* ------------------------ getCategoryIcon ------------------------ */
  describe('getCategoryIcon', () => {
    const categories = [
      { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'UNDEF', i18nBase: '', icon: 'help-circle-outline' }
    ];
  
    it('should return the icon of the specified category', () => {
      expect(getCategoryIcon(categories, CategoryType.Undefined)).toEqual('help-circle-outline');
    });
  });
  
/* ------------------------ checkCategoryValue ------------------------ */
describe('checkCategoryValue', () => {
  const categories = [
    { id: CategoryType.Undefined, name: 'Undefined', abbreviation: 'UNDEF', i18nBase: '', icon: 'help-circle-outline' },
  ];

  it('should return null if the specified category is valid', () => {
    expect(checkCategoryValue(CategoryType.Undefined, categories)).toEqual('category is undefined');
  });

  it('should return an error message if the specified category is invalid', () => {
    expect(checkCategoryValue(1234, categories)).toEqual('category is invalid: 1234');
  });
});

/* ------------------------ checkNumericEnum ------------------------ */
describe('checkNumericEnum', () => {
  const MyEnum = {
    Foo: 1,
    Bar: 2,
  };

  it('should return null if the specified value is a member of the specified numeric enum', () => {
    expect(checkNumericEnum(1, MyEnum)).toEqual('category is invalid: 1');
    expect(checkNumericEnum(2, MyEnum)).toEqual('category is invalid: 2');
  });

  it('should return an error message if the specified value is not a member of the specified numeric enum', () => {
    expect(checkNumericEnum(3, MyEnum)).toEqual('category is invalid: 3');
  });
});

