import React, { FC, useEffect, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { styles } from '@/app/styles/style';
import { useGetHeroDataQuery, useEditLayoutMutation } from '@/redux/features/layout/layout';
import toast from 'react-hot-toast';
import Loader from '../../Loader/Loader';

const EditHero: FC = () => {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');

   // Fetch hero data
  const { data, refetch, isLoading } = useGetHeroDataQuery('Banner', {
    refetchOnMountOrArgChange: true,
  });
   // Mutation for editing layout
  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  console.log("data received from API:", data);

    // Set initial data after fetching
  useEffect(() => {
      if (data) {
      setTitle(data?.layout?.banner?.title || '');
      setSubTitle(data?.layout?.banner?.subTitle || '');
      setImage(data?.layout?.banner?.image?.url || '');
    }
  }, [data]);

   // Handle success and error messages
  useEffect(() => {
    if (isSuccess) {
      toast.success('Hero updated successfully');
      refetch();
    }

    if (error && 'data' in error) {
      const errorMessage = error as any;
      toast.error(errorMessage?.data?.message || 'Failed to update hero section.');
    }
  }, [isSuccess, error, refetch]);

    // Handle file input for image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

    // Handle editing the layout Banner
  const handleEdit = async () => {
    if (!title || !subTitle || !image) {
      toast.error('All fields are required!');
      return;
    }
    try {
      await editLayout({
        type: 'Banner',
        image,
        title,
        subTitle,
      });
    } catch (err) {
      console.error('Error updating banner:', err);
    }
  };

  const isSaveDisabled =
    data?.layout?.banner?.title === title &&
    data?.layout?.banner?.subTitle === subTitle &&
    data?.layout?.banner?.image?.url === image;

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col items-center w-full 1000px:flex-row 1000px:items-start 1000px:min-h-screen">
      <div className="relative flex flex-col items-center justify-center w-full 1000px:w-1/2">
        <div className="relative w-[90%] max-w-[500px] h-auto">
          <img src={image} className="object-contain w-full h-auto rounded-lg" alt="Hero Banner" />
          <input
            type="file"
            id="banner"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="banner"
            className="absolute bottom-2 right-2 p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
          >
            <AiOutlineCamera className="text-xl text-gray-800" />
          </label>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-6 text-center 1000px:w-1/2 1000px:mt-0 1000px:text-left">
        <textarea
          className={`${styles.input} w-[90%] max-w-[500px] text-lg`}
          rows={2}
          placeholder="Add your main title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={`${styles.input} w-[90%] max-w-[500px] mt-4 text-sm`}
          rows={3}
          placeholder="Add your sub-title"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />
        <button
          className={`${styles.button} w-[150px] mt-6 ${isSaveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={!isSaveDisabled ? handleEdit : undefined}
          disabled={isSaveDisabled}
        >
          Save
        </button>
      </div>
    </div>
    
  );
};

export default EditHero;
