import { useForm, Controller } from 'react-hook-form';
import { CREATE_NEWS_DIALOG_TABS } from '@/lib/contants';
import { useRef, useState, useEffect, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import ReactSelect from 'react-select';
import { Checkbox } from '@/components/ui/checkbox';
import DialogContainer from '@/components/DialogContainer';
import Tabs from '@/components/Tabs';
import { NewsStatus, ModerationStatus, type CreateNews, type News } from '@/types/news';
import NewsDetailGeneric from '@/components/news/NewsDetailGeneric';
import NewsDetails from '@/components/news/NewsDetails';

import Tiptap from '@/components/editor/Tiptap';
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery';
import { useTagsQuery } from '@/hooks/queries/useTagsQuery';



interface EditNewsDialogProps {
  news: News | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NEWS_STATUS = [
  `${NewsStatus.Draft}`,
  `${NewsStatus.Published}`,
  `${NewsStatus.Scheduled}`,
];

const NEWS_VISIBILITY = ['Featured on Homepage', 'Include in Newsletter'];

const editNewsDialogOptions = [
  CREATE_NEWS_DIALOG_TABS.basic_info,
  CREATE_NEWS_DIALOG_TABS.content,
  CREATE_NEWS_DIALOG_TABS.publishing,
  CREATE_NEWS_DIALOG_TABS.preview,
];

type EditNewsType = Omit<CreateNews, 'id'>;

export const EditNewsDialog = ({
  news,
  open,
  onOpenChange,
}: EditNewsDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(
    CREATE_NEWS_DIALOG_TABS.basic_info
  );
  const [finalNewsDetails, setFinalNewsDetails] = useState<any>();
  const [selectedNewsStatus, setSelectedNewsStatus] = useState<NewsStatus>(
    NewsStatus.Draft
  );
  const [selectedNewsVisibility, setSelectedNewsVisibility] = useState<string>(
    NEWS_VISIBILITY[0]
  );
  const [date, setStartDate] = useState(new Date());
  const [time, setTime] = useState<string>('10:00');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const fileFeaturedImageInputRef = useRef<HTMLInputElement>(null);
  const [selectPrimaryCategory, setSelectPrimaryCategory] = useState<{
    label: string;
    value: number;
  } | undefined>();
  const [selectSecondaryCategory, setSelectSecondaryCategory] = useState<{
    label: string;
    value: number;
  } | undefined>();
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [formGeneralError, setFormGeneralError] = useState('');

  // Fetch categories and tags
  const { data: categoriesData } = useCategoriesQuery({ section: 'News', limit: 100 });
  const { data: tagsData } = useTagsQuery();

  // This state holds the full, unchanging list of categories in the correct format for ReactSelect
  const allCategoriesAsOptions = categoriesData?.categories?.map((category) => {
    return {
      value: category.id,
      label: category.name,
    };
  }) || [];

  const incomingTags = tagsData?.tags?.map((tag: any) => {
    return {
      value: tag.id,
      label: tag.name,
    };
  }) || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      headline: '',
      seo_title: '',
      url_slug: '',
      articleContent: '',
      allow_comments: false,
      published_date: '',
      published_time: '10:00',
    },
  });

  // Populate form with news data when news changes
  useEffect(() => {
    if (news) {
      setValue('headline', news.headline || '');
      setValue('seo_title', news.seo_title || '');
      setValue('url_slug', news.url_slug || '');
      setValue('articleContent', news.content || '');
      setValue('allow_comments', false); // Set based on your logic

      setSelectedNewsStatus(news.status || NewsStatus.Draft);
      setSelectedNewsVisibility(news.is_featured ? 'Featured on Homepage' : 'Include in Newsletter');
      
      // Set featured image
      setFeaturedImage(news.image || null);

      // Set date and time from published_date
      if (news.published_date) {
        const publishedDate = new Date(news.published_date);
        setStartDate(publishedDate);
        setTime(`${publishedDate.getHours().toString().padStart(2, '0')}:${publishedDate.getMinutes().toString().padStart(2, '0')}`);
        setValue('published_date', publishedDate.toISOString().split('T')[0]);
        setValue('published_time', `${publishedDate.getHours().toString().padStart(2, '0')}:${publishedDate.getMinutes().toString().padStart(2, '0')}`);
      }

      // Set categories
      if (news.newsCategories && news.newsCategories.length > 0) {
        const primaryCategory = news.newsCategories.find(cat => cat.type === 'Primary');
        const secondaryCategory = news.newsCategories.find(cat => cat.type === 'Secondary');
        
        if (primaryCategory) {
          setSelectPrimaryCategory({
            value: primaryCategory.category.id,
            label: primaryCategory.category.name,
          });
        }
        
        if (secondaryCategory) {
          setSelectSecondaryCategory({
            value: secondaryCategory.category.id,
            label: secondaryCategory.category.name,
          });
        }
      }

      // Set tags
      if (news.newsTags && news.newsTags.length > 0) {
        const tags = news.newsTags.map((newsTag: any) => ({
          value: newsTag.tag?.id || 0,
          label: newsTag.tag?.name || '',
        }));
        setSelectedTags(tags);
      }
    }
  }, [news, setValue]);

  const handleBackClick = () => {
    setFormGeneralError('');
    if (selectedTab === CREATE_NEWS_DIALOG_TABS.preview) {
      setSelectedTab(CREATE_NEWS_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_NEWS_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_NEWS_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_NEWS_DIALOG_TABS.content) {
      setSelectedTab(CREATE_NEWS_DIALOG_TABS.basic_info);
      return;
    }

    onOpenChange(false);
    resetAll();
  };

  const isFormValidated = (currentTab: string): boolean => {
    if (currentTab === CREATE_NEWS_DIALOG_TABS.basic_info) {
      if (!featuredImage) {
        setFormGeneralError('Featured image is required.');
        return false;
      }
      if (!selectPrimaryCategory) {
        setFormGeneralError('Primary category is required.');
        return false;
      }
      return true;
    }

    if (currentTab === CREATE_NEWS_DIALOG_TABS.content) {
      return true;
    }

    if (currentTab === CREATE_NEWS_DIALOG_TABS.publishing) {
      if (!date || !time || !selectedNewsStatus) return false;
    }

    return true;
  };

  const nextButtonClick = async (formData: any) => {
    if (!isFormValidated(selectedTab)) {
      setFormGeneralError('Invalid data on form');
      return;
    }

    setFormGeneralError('');

    const { headline, seo_title, url_slug, articleContent, allow_comments } =
      formData;
    
    const newsData: EditNewsType = {
      headline,
      seo_title,
      url_slug,
      content: articleContent,
      image: featuredImage || '',
      is_featured: selectedNewsVisibility === 'Featured on Homepage',
      status: selectedNewsStatus,
      moderation_status: ModerationStatus.Pending,
      published_date: formData.published_date,
      published_time: formData.published_time,
      visibility: selectedNewsVisibility === 'Featured on Homepage' ? 'Public' : 'Public',
      allow_comments,
      tags: selectedTags.length > 0 ? selectedTags.map((tag: any) => tag.label) : [],
      category_ids: selectPrimaryCategory ? [selectPrimaryCategory.value] : [],
      secondary_category_ids: selectSecondaryCategory ? [selectSecondaryCategory.value] : [],
      tag_names: selectedTags.length > 0 ? selectedTags.map((tag: any) => tag.label) : [],
    };

    const newsForDisplay = {
      ...newsData,
      categories: [
        selectPrimaryCategory?.label,
        selectSecondaryCategory?.label,
      ].filter(Boolean),
      tags: selectedTags.map((tag: any) => {
        return { tag: { name: tag.label } };
      }),
    };

    setFinalNewsDetails(newsForDisplay);

    if (selectedTab === CREATE_NEWS_DIALOG_TABS.basic_info) {
      setSelectedTab(CREATE_NEWS_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_NEWS_DIALOG_TABS.content) {
      setSelectedTab(CREATE_NEWS_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_NEWS_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_NEWS_DIALOG_TABS.preview);
      return;
    }

    updateNews(newsData);
  };

  const updateNews = async (newsData: EditNewsType) => {
    if (!news || !newsData) return;
    setLoading(true);
    try {
      onOpenChange(false);
      // You might want to update the news list here or show a success message
    } catch (error) {
      console.error('Error updating news:', error);
      setFormGeneralError('Failed to update news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (
    newValue: {
      label: string;
      value: number;
    } | null,
    type: 'primary' | 'secondary'
  ) => {
    if (type === 'primary') {
      setSelectPrimaryCategory(newValue || undefined);
    } else {
      setSelectSecondaryCategory(newValue || undefined);
    }
  };

  const handleFeaturedImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFeaturedImage(null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setFeaturedImage(imageUrl);
  };

  const handleFeaturedImageDivClick = () => {
    fileFeaturedImageInputRef.current?.click();
  };

  const resetAll = () => {
    reset();
    setSelectedTab(CREATE_NEWS_DIALOG_TABS.basic_info);
    setFeaturedImage(null);
    setSelectPrimaryCategory(undefined);
    setSelectSecondaryCategory(undefined);
    setSelectedTags([]);
    setFormGeneralError('');
    setStartDate(new Date());
    setTime('10:00');
    setSelectedNewsStatus(NewsStatus.Draft);
    setSelectedNewsVisibility(NEWS_VISIBILITY[0]);
    setFinalNewsDetails(undefined);
  };

  // Derived state: categories available for selection in the dropdowns
  const availableCategoriesForSelect = allCategoriesAsOptions.filter(
    (category) =>
      category.value !== selectPrimaryCategory?.value &&
      category.value !== selectSecondaryCategory?.value
  );

  if (!news) return null;

  return (
    <DialogContainer
      title='Edit News'
      open={open}
      onOpenChange={onOpenChange}
      maxWidth='4xl'
      resetOnClose={true}
      resetAll={resetAll}
    >
      <Tabs
        options={editNewsDialogOptions}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabClickable={false}
      />

      <>
        {selectedTab === CREATE_NEWS_DIALOG_TABS.basic_info && (
          <div className='flex flex-col gap-5 justify-center px-6 py-4'>
            <div className='flex flex-col gap-1'>
              <p>HEADLINE *</p>
              <Input
                placeholder='Type'
                {...register('headline', {
                  required: true,
                })}
              />
              {errors.headline && (
                <p className='text-red-500 text-sm'>Required</p>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <p>SEO TITLE (OPTIONAL)</p>
              <Input placeholder='Type' {...register('seo_title')} />
            </div>

            <div className='flex flex-col gap-1'>
              <p>URL SLUG *</p>
              <Input
                placeholder='Type'
                {...register('url_slug', {
                  required: true,
                })}
              />
              {errors.url_slug && (
                <p className='text-red-500 text-sm'>Required</p>
              )}
            </div>

            <div className='flex gap-4'>
              <div className='flex flex-col gap-1 w-3/6'>
                <p>PRIMARY CATEGORY *</p>
                <ReactSelect
                  options={availableCategoriesForSelect}
                  value={selectPrimaryCategory}
                  onChange={(newValue) =>
                    handleCategoryChange(newValue, 'primary')
                  }
                  isClearable
                />
              </div>
              <div className='flex flex-col gap-1 w-3/6'>
                <p>SECONDARY CATEGORY (2 MAX)</p>
                <ReactSelect
                  options={availableCategoriesForSelect}
                  value={selectSecondaryCategory}
                  onChange={(newValue) =>
                    handleCategoryChange(newValue, 'secondary')
                  }
                  isClearable
                />
              </div>
            </div>

            <div className='flex flex-col gap-1 justify-center mt-3'>
              <p>FEATURED IMAGE*</p>
              <input
                type='file'
                accept='image/*'
                ref={fileFeaturedImageInputRef}
                onChange={handleFeaturedImageChange}
                style={{ display: 'none' }}
              />
              <div
                className='flex items-center justify-center rounded-md bg-[#F2F2F2] w-[320px] h-[200px] cursor-pointer'
                onClick={handleFeaturedImageDivClick}
              >
                {featuredImage ? (
                  <div>
                    <img
                      src={featuredImage}
                      alt='Featured Image'
                      className='w-80 h-50 rounded'
                    />
                  </div>
                ) : (
                  <svg
                    width='16'
                    height='20'
                    viewBox='0 0 16 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M2.90265 20C1.9469 20 1.22419 19.7611 0.734513 19.2832C0.244838 18.8054 0 18.0973 0 17.1591V8.55769C0 7.62529 0.244838 6.92016 0.734513 6.44231C1.22419 5.95862 1.9469 5.71678 2.90265 5.71678H5.46903V7.43881H3.00885C2.59587 7.43881 2.28024 7.54662 2.06195 7.76224C1.84956 7.97203 1.74336 8.28963 1.74336 8.71504V17.0105C1.74336 17.4359 1.84956 17.7535 2.06195 17.9633C2.28024 18.1789 2.59587 18.2867 3.00885 18.2867H12.9823C13.3894 18.2867 13.7021 18.1789 13.9204 17.9633C14.1445 17.7535 14.2566 17.4359 14.2566 17.0105V8.71504C14.2566 8.28963 14.1445 7.97203 13.9204 7.76224C13.7021 7.54662 13.3894 7.43881 12.9823 7.43881H10.531V5.71678H13.0973C14.0531 5.71678 14.7758 5.95862 15.2655 6.44231C15.7552 6.92016 16 7.62529 16 8.55769V17.1591C16 18.0915 15.7552 18.7966 15.2655 19.2745C14.7758 19.7582 14.0531 20 13.0973 20H2.90265ZM8 13.0332C7.77581 13.0332 7.58112 12.9545 7.41593 12.7972C7.25664 12.6399 7.17699 12.4534 7.17699 12.2378V3.43531L7.24779 2.13287L6.69027 2.77098L5.45133 4.08217C5.30973 4.23951 5.12684 4.31818 4.90265 4.31818C4.69617 4.31818 4.52212 4.25408 4.38053 4.12587C4.24484 3.99184 4.17699 3.82284 4.17699 3.61888C4.17699 3.4324 4.25074 3.26049 4.39823 3.10315L7.37168 0.27972C7.48378 0.174825 7.58997 0.101981 7.69027 0.0611888C7.79056 0.0203963 7.89381 0 8 0C8.10619 0 8.20944 0.0203963 8.30973 0.0611888C8.41003 0.101981 8.51327 0.174825 8.61947 0.27972L11.5929 3.10315C11.7463 3.26049 11.823 3.4324 11.823 3.61888C11.823 3.82284 11.7493 3.99184 11.6018 4.12587C11.4602 4.25408 11.2891 4.31818 11.0885 4.31818C10.8702 4.31818 10.6873 4.23951 10.5398 4.08217L9.30089 2.77098L8.75221 2.13287L8.82301 3.43531V12.2378C8.82301 12.4534 8.74041 12.6399 8.57522 12.7972C8.41593 12.9545 8.22419 13.0332 8 13.0332Z'
                      fill='#CCCCCC'
                    />
                  </svg>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-1'>
              <p>Tags</p>
              <ReactSelect
                options={incomingTags}
                isMulti
                onChange={(newValues) => {
                  setSelectedTags(newValues as any[]);
                }}
                value={selectedTags}
              />
            </div>

            <p className='text-red-500'>{formGeneralError}</p>
          </div>
        )}

        {selectedTab === CREATE_NEWS_DIALOG_TABS.content && (
          <div className='flex flex-col gap-5 justify-center px-6'>
            <div className='flex flex-col gap-1'>
              <p>NEWS CONTENT *</p>
              <Controller
                name='articleContent'
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Tiptap content={field.value} onChange={field.onChange} />
                )}
              />
              {errors.articleContent && (
                <p className='text-red-500 text-sm'>Required</p>
              )}
            </div>
            <p className='text-red-500'>{formGeneralError}</p>
          </div>
        )}

        {selectedTab === CREATE_NEWS_DIALOG_TABS.publishing && (
          <div className='flex flex-col gap-5 justify-center px-6'>
            <div className='flex flex-col gap-1'>
              <p className='text-[#808080]'>STATUS *</p>
              <div className='flex items-center gap-2'>
                <Tabs
                  options={NEWS_STATUS}
                  selectedTab={selectedNewsStatus}
                  setSelectedTab={setSelectedNewsStatus}
                  tabClickable
                />
              </div>
            </div>

            

            <div className='flex gap-4'>
              <div className='flex-1'>
                <p className='font-[inter] font-medium text-[14px] text-[#808080] mb-1'>DATE</p>
                <Controller
                  control={control}
                  name='published_date'
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className={errors?.published_date ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors?.published_date && <p className="text-red-500 text-xs mt-1">{errors.published_date.message}</p>}
              </div>
              <div className='flex-1'>
                <p className='font-[inter] font-medium text-[14px] text-[#808080] mb-1'>TIME</p>
                <Controller
                  control={control}
                  name='published_time'
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      className={errors?.published_time ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors?.published_time && <p className="text-red-500 text-xs mt-1">{errors.published_time.message}</p>}
              </div>
          </div>

            <div className='flex flex-col gap-1'>
              <p className='text-[#808080]'>VISIBILITY</p>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <Tabs
                    options={NEWS_VISIBILITY}
                    selectedTab={selectedNewsVisibility}
                    setSelectedTab={setSelectedNewsVisibility}
                    tabClickable
                    showIcon
                  />
                </div>
                <div className='border border-[#F2F2F2] flex gap-2 items-center rounded-md w-fit px-2 py-1'>
                  <Controller
                    control={control}
                    name='allow_comments'
                    render={({ field }) => (
                      <Checkbox
                        id='allowComments'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <label htmlFor='confirmation'>Allow Comments</label>
                </div>
              </div>
            </div>

            <p className='text-red-500'>{formGeneralError}</p>
            <div className='h-28' />
          </div>
        )}

        {selectedTab === CREATE_NEWS_DIALOG_TABS.preview && (
          <>
            <NewsDetailGeneric news={finalNewsDetails!} />
            <NewsDetails news={finalNewsDetails!} />
          </>
        )}

        {/* BUTTONS */}
        <div className='flex items-center gap-3 mb-6 px-6'>
          <div
            className='w-3/6 text-center border border-[#F2F2F2] rounded-md py-1 cursor-pointer'
            onClick={handleBackClick}
          >
            {selectedTab === CREATE_NEWS_DIALOG_TABS.basic_info
              ? 'Cancel'
              : 'Back'}
          </div>
          <button
            type='submit'
            className='w-3/6 text-center bg-black text-white rounded-md py-1 cursor-pointer'
            onClick={handleSubmit(nextButtonClick)}
          >
            {loading
              ? '...'
              : selectedTab === CREATE_NEWS_DIALOG_TABS.publishing
              ? 'Preview'
              : selectedTab === CREATE_NEWS_DIALOG_TABS.preview
              ? 'Update'
              : 'Next'}
          </button>
        </div>
      </>
    </DialogContainer>
  );
};
