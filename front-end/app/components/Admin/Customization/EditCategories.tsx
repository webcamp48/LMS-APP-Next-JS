import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layout';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Loader from '../../Loader/Loader';
import { styles } from './../../../styles/style';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';

type Props = {}

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true
  });
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<any>([]);

  //set categories when data changes
  useEffect(() => {
    if (data && isSuccess) {
      setCategories(data.layout.categories); 
      toast.success("Categories Updated Successfully!");
    }
    refetch();
  }, [data, isSuccess]);


  // Handler to remove a category by its ID
  const removeCategories = (categoryId: any) => {
    setCategories((prev: any) => prev.filter((i: any) => i._id !== categoryId));
  };

  // Handler to update category title based on user input
  const handlerCategoriesAdd = (id: any, value: any) => {
    setCategories((prevCategories: any) =>
      prevCategories.map((i: any) =>
        i._id === id ? { ...i, title: value } : i
      )
    );
  };

  // Handler to add a new category when clicked
  const newAddCategoriesHandler = () => {
    // Check if the last category has an empty title
    if (categories[categories.length - 1]?.title === '') {
      toast.error("Category title cannot be empty!");
    } else {
      // Add a new category with an empty title
      setCategories((prevCategories: any) => [
        ...prevCategories,
        { title: "" },
      ]);
    }
  };

  // Helper function to check if the original and new categories are the same
  const areCategoriesUnchanged = (originalCategories: any[], newCategories: any[]) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  // Helper function to check if any category title is empty
  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((category: any) => category.title === '');
  };

  // Handler to save the updated categories after checking for changes
  const EditCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data.layout.categories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({
        type: "Categories",
        categories
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories && categories.map((item: any, index: number) => (
            <div key={index} className="p-3">
              <div className="flex justify-center items-center w-full">
                <input
                  type="text"
                  className={`${styles.input} !w-unset !border-none text-[20px]`}
                  value={item.title}
                  onChange={(e) => handlerCategoriesAdd(item._id, e.target.value)} // Handle title change
                  placeholder="Enter Categories Name"
                />
                <AiOutlineDelete
                  className="text-black dark:text-white text-[18px] cursor-pointer"
                  onClick={() => removeCategories(item._id)} 
                />
              </div>
            </div>
          ))}
          <br /> <br />
          <div className='flex justify-center'>
            <IoMdAddCircleOutline
              className='text-black dark:text-white cursor-pointer text-[18px]'
              onClick={newAddCategoriesHandler} 
            />
          </div>
          <div className={`${styles.button} !w-[100px] !min-h-[40] !h-[40px] text-black dark:text-white bg-[#0000c3]
          ${
            areCategoriesUnchanged(data.layout.categories, categories) ||
            isAnyCategoryTitleEmpty(categories) ? 
            "!cursor-not-allowed" : "cursor-pointer bg-[#a739ba]"
          }
          rounded absolute bottom-12 right-12
          `} onClick={
            areCategoriesUnchanged(data.layout.categories, categories) ||
            isAnyCategoryTitleEmpty(categories) 
            ? () => null 
            : EditCategoriesHandler 
          }>
            Save
          </div>
        </div>
      )}
      {error && <div className="text-red-500">Error updating categories</div>}
    </>
  );
};

export default EditCategories;
