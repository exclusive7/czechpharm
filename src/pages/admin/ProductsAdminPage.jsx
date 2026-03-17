import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  isKnownProductImage,
  productImageOptions,
  resetProducts,
  resolveProductImage,
  updateProduct,
  uploadProductImage,
} from "../../data/productsStore";
import {
  buildCategoryOptions,
  createCategory,
  deleteCategory,
  getCategoryTitle,
  getFallbackCategoryValue,
  updateCategory,
  updateFooterSettings,
  updateHomeProductsSettings,
} from "../../data/siteContentStore";
import { updateContactSettings } from "../../data/contactSettingsStore";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { ADMIN_SECTIONS } from "../../data/adminSections";
import { useProducts } from "../../hooks/useProducts";
import { useContactSettings } from "../../hooks/useContactSettings";
import { useSiteContent } from "../../hooks/useSiteContent";

const EMPTY_DETAIL = { label: "", value: "" };
const EMPTY_CATEGORY = { value: "", title: "" };
const DEFAULT_DETAIL_LABELS = [
  "Действующее вещество",
  "Страна",
  "Дозировка",
  "Производитель",
  "Форма выпуска",
  "Применение",
];

function defaultDetails() {
  return DEFAULT_DETAIL_LABELS.map((label) => ({ label, value: "" }));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(new Error("Не удалось прочитать файл изображения."));
    reader.readAsDataURL(file);
  });
}

function buildProductForm(product, categories) {
  const fallbackCategory = getFallbackCategoryValue(categories);
  const category = categories.some((item) => item.value === product?.category)
    ? product.category
    : fallbackCategory;
  const useAssetImage = isKnownProductImage(product?.image ?? "");

  return {
    name: product?.name ?? "",
    category,
    summary: product?.summary ?? "",
    imageAsset: useAssetImage ? product?.image ?? "" : "",
    imageUrl: useAssetImage ? "" : product?.image ?? "",
    desc:
      Array.isArray(product?.desc) && product.desc.length > 0
        ? product.desc.map((item) => ({
            label: item.label ?? "",
            value: item.value ?? "",
          }))
        : defaultDetails(),
  };
}

function productPayload(formState) {
  return {
    name: formState.name.trim(),
    category: formState.category,
    summary: formState.summary.trim(),
    image: formState.imageUrl.trim() || formState.imageAsset.trim(),
    desc: formState.desc
      .map((item) => ({ label: item.label.trim(), value: item.value.trim() }))
      .filter((item) => item.label || item.value),
  };
}

function moveValue(values, value, direction) {
  const index = values.indexOf(value);
  const nextIndex = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || nextIndex < 0 || nextIndex >= values.length) {
    return values;
  }

  const next = [...values];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

function ProductForm({
  categories,
  formState,
  onChange,
  onDetailChange,
  onDetailAdd,
  onDetailRemove,
  onImageUpload,
  onSubmit,
  preview,
  submitLabel,
  saving,
  uploadingImage,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
            Название препарата
          </span>
          <input
            type="text"
            value={formState.name}
            onChange={(event) => onChange("name", event.target.value)}
            className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
            placeholder="Название препарата"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
            Категория
          </span>
          <select
            value={formState.category}
            onChange={(event) => onChange("category", event.target.value)}
            className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
          Краткое описание
        </span>
        <textarea
          value={formState.summary}
          onChange={(event) => onChange("summary", event.target.value)}
          className="min-h-[110px] w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
          placeholder="Краткий текст для главной страницы и аккордеона"
        />
      </label>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
            Изображение из проекта
          </span>
          <select
            value={formState.imageAsset}
            onChange={(event) => onChange("imageAsset", event.target.value)}
            className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
          >
            <option value="">Выберите файл</option>
            {productImageOptions.map((image) => (
              <option key={image} value={image}>
                {image}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
            Внешний или загруженный URL
          </span>
          <input
            type="text"
            value={formState.imageUrl}
            onChange={(event) => onChange("imageUrl", event.target.value)}
            className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
            placeholder="/uploads/... или https://..."
          />
        </label>
        <div className="rounded-[18px] border border-dashed border-[#D8DEEA] bg-[#F7F9FC] p-4">
          <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
            Превью
          </span>
          {preview ? (
            <img src={preview} alt="" className="h-[120px] w-full object-contain" />
          ) : (
            <div className="flex h-[120px] items-center justify-center text-sm text-[#6C7485]">
              Нет изображения
            </div>
          )}
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
          Загрузка изображения
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 text-sm"
        />
        <span className="mt-2 block text-xs text-[#6C7485]">
          {uploadingImage
            ? "Загрузка изображения..."
            : "Загруженный файл будет сохранен в public/uploads."}
        </span>
      </label>

      <div className="rounded-[18px] border border-[#D8DEEA] bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[#1C2561]">Характеристики</h2>
          <button
            type="button"
            onClick={onDetailAdd}
            className="rounded-full border border-[#1C2561] px-4 py-2 text-sm font-semibold text-[#1C2561] transition hover:bg-[#1C2561] hover:text-white"
          >
            Добавить поле
          </button>
        </div>
        <div className="space-y-4">
          {formState.desc.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-[#D8DEEA] px-4 py-5 text-sm text-[#6C7485]">
              Поля удалены. Используйте "Добавить поле", чтобы создать новую строку.
            </div>
          ) : null}
          {formState.desc.map((item, index) => (
            <div
              key={`${index}-${item.label}`}
              className="grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)_44px]"
            >
              <input
                type="text"
                value={item.label}
                onChange={(event) =>
                  onDetailChange(index, "label", event.target.value)
                }
                className="rounded-[14px] border border-[#D8DEEA] px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="Название поля"
              />
              <input
                type="text"
                value={item.value}
                onChange={(event) =>
                  onDetailChange(index, "value", event.target.value)
                }
                className="rounded-[14px] border border-[#D8DEEA] px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="Значение"
              />
              <button
                type="button"
                onClick={() => onDetailRemove(index)}
                className="rounded-[14px] border border-[#F1C9CC] text-lg font-semibold text-[#F61114] transition hover:bg-[#FFF1F2]"
                aria-label="Удалить поле"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || uploadingImage}
        className="rounded-full bg-[#F61114] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d71013] disabled:cursor-not-allowed disabled:bg-[#F39B9D]"
      >
        {saving ? "Сохранение..." : submitLabel}
      </button>
    </form>
  );
}

export default function ProductsAdminPage() {
  const { logout } = useAdminAuth();
  const { products, loading, error } = useProducts();
  const {
    siteContent,
    loading: siteContentLoading,
    error: siteContentError,
  } = useSiteContent();
  const {
    contactSettings,
    loading: contactSettingsLoading,
    error: contactSettingsError,
  } = useContactSettings();
  const categories = siteContent.categories;
  const categoryOptions = buildCategoryOptions(categories).filter(
    (item) => item.value !== "all"
  );
  const stats = categories.map((category) => ({
    ...category,
    count: products.filter((item) => item.category === category.value).length,
  }));
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [formState, setFormState] = useState(() =>
    buildProductForm(null, categories)
  );
  const [isCreating, setIsCreating] = useState(true);
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState(null);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
  const [isCreatingCategory, setIsCreatingCategory] = useState(true);
  const [categorySaving, setCategorySaving] = useState(false);
  const [homeForm, setHomeForm] = useState({
    eyebrow: siteContent.homeProducts.eyebrow,
    titlePrimary: siteContent.homeProducts.titlePrimary,
    titleAccent: siteContent.homeProducts.titleAccent,
    categoryValues: [...siteContent.homeProducts.categoryValues],
  });
  const [homeSaving, setHomeSaving] = useState(false);
  const [footerForm, setFooterForm] = useState({
    year: siteContent.footer.year,
    siteUrl: siteContent.footer.siteUrl,
    phoneUrl: siteContent.footer.phoneUrl,
    telegramUrl: siteContent.footer.telegramUrl,
    facebookUrl: siteContent.footer.facebookUrl,
    linkedinUrl: siteContent.footer.linkedinUrl,
  });
  const [footerSaving, setFooterSaving] = useState(false);
  const [contactSettingsForm, setContactSettingsForm] = useState({
    telegramBotToken: "",
    telegramChatId: contactSettings.telegramChatId,
  });
  const [contactSettingsSaving, setContactSettingsSaving] = useState(false);
  const selectedProduct =
    products.find((item) => item.id === selectedId) ?? null;
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const preview = resolveProductImage(
    formState.imageUrl || formState.imageAsset
  );

  useEffect(() => {
    if (!notice) {
      return undefined;
    }
    const timeoutId = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    setHomeForm({
      eyebrow: siteContent.homeProducts.eyebrow,
      titlePrimary: siteContent.homeProducts.titlePrimary,
      titleAccent: siteContent.homeProducts.titleAccent,
      categoryValues: [...siteContent.homeProducts.categoryValues],
    });
    setFooterForm({
      year: siteContent.footer.year,
      siteUrl: siteContent.footer.siteUrl,
      phoneUrl: siteContent.footer.phoneUrl,
      telegramUrl: siteContent.footer.telegramUrl,
      facebookUrl: siteContent.footer.facebookUrl,
      linkedinUrl: siteContent.footer.linkedinUrl,
    });
  }, [siteContent]);

  useEffect(() => {
    setContactSettingsForm({
      telegramBotToken: "",
      telegramChatId: contactSettings.telegramChatId,
    });
  }, [contactSettings]);

  useEffect(() => {
    if (!categories.some((item) => item.value === formState.category)) {
      setFormState((current) => ({
        ...current,
        category: getFallbackCategoryValue(categories),
      }));
    }
  }, [categories, formState.category]);

  useEffect(() => {
    if (
      selectedCategoryValue &&
      !categories.some((item) => item.value === selectedCategoryValue)
    ) {
      setSelectedCategoryValue(null);
      setCategoryForm(EMPTY_CATEGORY);
      setIsCreatingCategory(true);
    }
  }, [categories, selectedCategoryValue]);

  const pushNotice = (type, message) => setNotice({ type, message });
  const handleCreateNew = () => {
    setSelectedId(null);
    setFormState(buildProductForm(null, categories));
    setIsCreating(true);
  };

  const handleSelectProduct = (product) => {
    setSelectedId(product.id);
    setFormState(buildProductForm(product, categories));
    setIsCreating(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingImage(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const imageUrl = await uploadProductImage({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        base64Data: dataUrl.split(",")[1] ?? "",
      });

      setFormState((current) => ({
        ...current,
        imageUrl,
        imageAsset: "",
      }));
      pushNotice("success", "Изображение загружено.");
    } catch (uploadError) {
      pushNotice("error", uploadError.message || "Не удалось загрузить изображение.");
    } finally {
      event.target.value = "";
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = productPayload(formState);

    if (!payload.name) {
      pushNotice("error", "Название препарата обязательно.");
      return;
    }

    setSaving(true);

    try {
      if (isCreating) {
        const created = await createProduct(payload);
        setSelectedId(created.id);
        setFormState(buildProductForm(created, categories));
        setIsCreating(false);
        pushNotice("success", "Препарат добавлен.");
      } else if (selectedProduct) {
        const updated = await updateProduct(selectedProduct.id, payload);
        setFormState(buildProductForm(updated, categories));
        pushNotice("success", "Изменения сохранены.");
      } else {
        pushNotice("error", "Выберите препарат для изменения.");
      }
    } catch (saveError) {
      pushNotice("error", saveError.message || "Не удалось сохранить препарат.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    const product = products.find((item) => item.id === productId);

    if (!product || !window.confirm(`Удалить ${product.name}?`)) {
      return;
    }

    setSaving(true);

    try {
      await deleteProduct(productId);
      handleCreateNew();
      pushNotice("success", "Препарат удален.");
    } catch (deleteError) {
      pushNotice("error", deleteError.message || "Не удалось удалить препарат.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Восстановить каталог по умолчанию?")) {
      return;
    }

    setSaving(true);

    try {
      await resetProducts();
      handleCreateNew();
      pushNotice("success", "Каталог восстановлен.");
    } catch (resetError) {
      pushNotice("error", resetError.message || "Не удалось восстановить каталог.");
    } finally {
      setSaving(false);
    }
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    if (!categoryForm.value.trim() || !categoryForm.title.trim()) {
      pushNotice("error", "Заполните код и название категории.");
      return;
    }

    setCategorySaving(true);

    try {
      if (isCreatingCategory) {
        await createCategory(categoryForm);
        pushNotice("success", "Категория добавлена.");
        setCategoryForm(EMPTY_CATEGORY);
      } else if (selectedCategoryValue) {
        await updateCategory(selectedCategoryValue, categoryForm);
        setSelectedCategoryValue(categoryForm.value.trim().toLowerCase());
        pushNotice("success", "Категория изменена.");
      }
    } catch (saveError) {
      pushNotice("error", saveError.message || "Не удалось сохранить категорию.");
    } finally {
      setCategorySaving(false);
    }
  };

  const handleCategoryDelete = async () => {
    if (!selectedCategoryValue) {
      pushNotice("error", "Выберите категорию для удаления.");
      return;
    }

    if (
      !window.confirm(
        "Удалить категорию? Связанные препараты будут перенесены в первую доступную категорию."
      )
    ) {
      return;
    }

    setCategorySaving(true);

    try {
      await deleteCategory(selectedCategoryValue);
      setSelectedCategoryValue(null);
      setCategoryForm(EMPTY_CATEGORY);
      setIsCreatingCategory(true);
      pushNotice("success", "Категория удалена.");
    } catch (deleteError) {
      pushNotice("error", deleteError.message || "Не удалось удалить категорию.");
    } finally {
      setCategorySaving(false);
    }
  };

  const handleHomeSubmit = async (event) => {
    event.preventDefault();

    if (homeForm.categoryValues.length === 0) {
      pushNotice("error", "Выберите хотя бы одну категорию для главной страницы.");
      return;
    }

    setHomeSaving(true);

    try {
      await updateHomeProductsSettings(homeForm);
      pushNotice("success", "Главная страница обновлена.");
    } catch (saveError) {
      pushNotice("error", saveError.message || "Не удалось сохранить блок главной.");
    } finally {
      setHomeSaving(false);
    }
  };

  const handleFooterSubmit = async (event) => {
    event.preventDefault();

    if (!footerForm.year.trim()) {
      pushNotice("error", "Введите год.");
      return;
    }

    setFooterSaving(true);

    try {
      await updateFooterSettings({
        year: footerForm.year.trim(),
        siteUrl: footerForm.siteUrl.trim(),
        phoneUrl: footerForm.phoneUrl.trim(),
        telegramUrl: footerForm.telegramUrl.trim(),
        facebookUrl: footerForm.facebookUrl.trim(),
        linkedinUrl: footerForm.linkedinUrl.trim(),
      });
      pushNotice("success", "Футер обновлен.");
    } catch (saveError) {
      pushNotice("error", saveError.message || "Не удалось сохранить футер.");
    } finally {
      setFooterSaving(false);
    }
  };

  const handleContactSettingsSubmit = async (event) => {
    event.preventDefault();

    setContactSettingsSaving(true);

    try {
      await updateContactSettings({
        telegramBotToken: contactSettingsForm.telegramBotToken,
        telegramChatId: contactSettingsForm.telegramChatId,
      });
      setContactSettingsForm((current) => ({
        ...current,
        telegramBotToken: "",
      }));
      pushNotice("success", "Настройки Telegram сохранены.");
    } catch (saveError) {
      pushNotice(
        "error",
        saveError.message || "Не удалось сохранить настройки Telegram."
      );
    } finally {
      setContactSettingsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F7FB] px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] bg-[#16226C] p-6 text-white lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/70">
              Панель администратора
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Управление каталогом и сайтом</h1>
            <p className="mt-3 max-w-[720px] text-sm text-white/75">
              Здесь можно управлять препаратами, категориями, блоком препаратов на главной странице и годом в футере.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/products" className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold transition hover:bg-white hover:text-[#16226C]">
              Открыть каталог
            </Link>
            <button type="button" onClick={handleCreateNew} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#16226C] transition hover:bg-[#E9EEFF]">
              Новый препарат
            </button>
            <button type="button" onClick={logout} className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#16226C]">
              Выйти
            </button>
          </div>
        </div>

        {notice ? (
          <div className={`rounded-[18px] px-5 py-4 text-sm ${notice.type === "error" ? "border border-[#F1C9CC] bg-[#FFF1F2] text-[#A32024]" : "border border-[#C7E1CF] bg-[#EDF9F1] text-[#24613A]"}`}>
            {notice.message}
          </div>
        ) : null}

        {siteContentError ? (
          <div className="rounded-[18px] border border-[#F1C9CC] bg-[#FFF1F2] px-5 py-4 text-sm text-[#A32024]">
            {siteContentError}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/manage"
            className="rounded-full border border-[#D8DEEA] bg-white px-5 py-3 text-sm font-semibold text-[#1C2561] transition hover:border-[#1C2561]"
          >
            Все разделы
          </Link>
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.id}
              to={section.to}
              className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                section.id === "catalog"
                  ? "border-[#1C2561] bg-[#1C2561] text-white"
                  : "border-[#D8DEEA] bg-white text-[#1C2561] hover:border-[#1C2561]"
              }`}
            >
              {section.title}
            </Link>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(22,34,108,0.08)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">Категории</p>
                <h2 className="mt-2 text-xl font-semibold text-[#1C2561]">Добавить, изменить, удалить</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryValue(null);
                  setCategoryForm(EMPTY_CATEGORY);
                  setIsCreatingCategory(true);
                }}
                className="rounded-full border border-[#1C2561] px-4 py-2 text-xs font-semibold text-[#1C2561] transition hover:bg-[#1C2561] hover:text-white"
              >
                Новая категория
              </button>
            </div>

            <div className="mb-5 grid gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryValue(category.value);
                    setCategoryForm({ value: category.value, title: category.title });
                    setIsCreatingCategory(false);
                  }}
                  className={`rounded-[18px] border px-4 py-3 text-left transition ${selectedCategoryValue === category.value ? "border-[#1C2561] bg-[#F7F9FF]" : "border-[#E5EAF2] bg-white"}`}
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6C7485]">{category.value}</div>
                  <div className="mt-1 text-sm font-semibold text-[#1C2561]">{category.title}</div>
                </button>
              ))}
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <input
                type="text"
                value={categoryForm.value}
                onChange={(event) => setCategoryForm((current) => ({ ...current, value: event.target.value }))}
                className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="Код категории"
              />
              <input
                type="text"
                value={categoryForm.title}
                onChange={(event) => setCategoryForm((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="Название категории"
              />
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={categorySaving || siteContentLoading} className="rounded-full bg-[#1C2561] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#141b4c] disabled:cursor-not-allowed disabled:opacity-60">
                  {categorySaving ? "Сохранение..." : isCreatingCategory ? "Добавить категорию" : "Сохранить категорию"}
                </button>
                {!isCreatingCategory ? (
                  <button type="button" onClick={handleCategoryDelete} disabled={categorySaving} className="rounded-full border border-[#F1C9CC] px-5 py-3 text-sm font-semibold text-[#F61114] transition hover:bg-[#FFF1F2] disabled:cursor-not-allowed disabled:opacity-60">
                    Удалить категорию
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(22,34,108,0.08)]">
            <div className="mb-5">
              <p className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">Главная страница</p>
              <h2 className="mt-2 text-xl font-semibold text-[#1C2561]">Блок препаратов</h2>
            </div>
            <form onSubmit={handleHomeSubmit} className="space-y-4">
              <div className="space-y-3">
                {categories.map((category) => {
                  const enabled = homeForm.categoryValues.includes(category.value);
                  const position = homeForm.categoryValues.indexOf(category.value);

                  return (
                    <div key={category.value} className="rounded-[16px] border border-[#E5EAF2] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-3 text-sm text-[#1C2561]">
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={() =>
                              setHomeForm((current) => {
                                const exists = current.categoryValues.includes(category.value);

                                if (exists && current.categoryValues.length === 1) {
                                  pushNotice("error", "На главной должна оставаться хотя бы одна категория.");
                                  return current;
                                }

                                return {
                                  ...current,
                                  categoryValues: exists
                                    ? current.categoryValues.filter((value) => value !== category.value)
                                    : [...current.categoryValues, category.value],
                                };
                              })
                            }
                          />
                          <span>{category.title}</span>
                        </label>
                        {enabled ? (
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setHomeForm((current) => ({ ...current, categoryValues: moveValue(current.categoryValues, category.value, "up") }))} disabled={position <= 0} className="rounded-full border border-[#D8DEEA] px-3 py-1 text-xs font-semibold text-[#1C2561] disabled:opacity-40">
                              Вверх
                            </button>
                            <button type="button" onClick={() => setHomeForm((current) => ({ ...current, categoryValues: moveValue(current.categoryValues, category.value, "down") }))} disabled={position >= homeForm.categoryValues.length - 1} className="rounded-full border border-[#D8DEEA] px-3 py-1 text-xs font-semibold text-[#1C2561] disabled:opacity-40">
                              Вниз
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button type="submit" disabled={homeSaving || siteContentLoading} className="rounded-full bg-[#1C2561] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#141b4c] disabled:cursor-not-allowed disabled:opacity-60">
                {homeSaving ? "Сохранение..." : "Сохранить блок главной"}
              </button>
            </form>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(22,34,108,0.08)]">
            <div className="mb-5">
              <p className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">Футер</p>
              <h2 className="mt-2 text-xl font-semibold text-[#1C2561]">Год и ссылки иконок</h2>
            </div>
            <form onSubmit={handleFooterSubmit} className="space-y-4">
              <input type="text" value={footerForm.year} onChange={(event) => setFooterForm((current) => ({ ...current, year: event.target.value }))} className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]" placeholder="Год" />
              <input type="text" value={footerForm.siteUrl} onChange={(event) => setFooterForm((current) => ({ ...current, siteUrl: event.target.value }))} className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]" placeholder="Ссылка на сайт" />
              <input type="text" value={footerForm.phoneUrl} onChange={(event) => setFooterForm((current) => ({ ...current, phoneUrl: event.target.value }))} className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]" placeholder="Телефонная ссылка" />
              <input type="text" value={footerForm.telegramUrl} onChange={(event) => setFooterForm((current) => ({ ...current, telegramUrl: event.target.value }))} className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]" placeholder="Ссылка Telegram" />
              <input type="text" value={footerForm.facebookUrl} onChange={(event) => setFooterForm((current) => ({ ...current, facebookUrl: event.target.value }))} className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]" placeholder="Ссылка Facebook" />
              <input type="text" value={footerForm.linkedinUrl} onChange={(event) => setFooterForm((current) => ({ ...current, linkedinUrl: event.target.value }))} className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]" placeholder="Ссылка LinkedIn" />
              <button type="submit" disabled={footerSaving || siteContentLoading} className="rounded-full bg-[#1C2561] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#141b4c] disabled:cursor-not-allowed disabled:opacity-60">
                {footerSaving ? "Сохранение..." : "Сохранить футер"}
              </button>
            </form>
          </section>

          <section className="hidden">
            <div className="mb-5">
              <p className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">Telegram</p>
              <h2 className="mt-2 text-xl font-semibold text-[#1C2561]">Форма обратной связи</h2>
            </div>
            <form onSubmit={handleContactSettingsSubmit} className="space-y-4">
              <input
                type="password"
                value={contactSettingsForm.telegramBotToken}
                onChange={(event) =>
                  setContactSettingsForm((current) => ({
                    ...current,
                    telegramBotToken: event.target.value,
                  }))
                }
                className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder={
                  contactSettings.botTokenConfigured
                    ? "Оставьте пустым, чтобы не менять токен"
                    : "Введите токен бота"
                }
              />
              <input
                type="password"
                value={contactSettingsForm.telegramChatId}
                onChange={(event) =>
                  setContactSettingsForm((current) => ({
                    ...current,
                    telegramChatId: event.target.value,
                  }))
                }
                className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="Group / chat id"
              />
              <button
                type="submit"
                disabled={contactSettingsSaving || contactSettingsLoading}
                className="rounded-full bg-[#1C2561] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#141b4c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {contactSettingsSaving ? "Сохранение..." : "Сохранить Telegram"}
              </button>
            </form>
          </section>
        </div>

        <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(22,34,108,0.08)] lg:p-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">
                Telegram
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#1C2561]">
                Форма обратной связи
              </h2>
              <p className="mt-2 max-w-[900px] text-sm text-[#4A5676]">
                Для отправки сообщений в группу нужны и токен бота, и ID
                группы или чата. Бота нужно добавить в группу и дать ему право
                отправлять сообщения.
              </p>
            </div>
            <button
              type="submit"
              form="telegram-settings-form"
              disabled={contactSettingsSaving || contactSettingsLoading}
              className="rounded-full bg-[#1C2561] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#141b4c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {contactSettingsSaving ? "Сохранение..." : "Сохранить Telegram"}
            </button>
          </div>

          {contactSettingsError ? (
            <div className="mt-5 rounded-[18px] border border-[#F1C9CC] bg-[#FFF1F2] px-5 py-4 text-sm text-[#A32024]">
              {contactSettingsError}
            </div>
          ) : null}

          <div className="mt-5 rounded-[18px] border border-[#D8DEEA] bg-[#F7F9FC] px-5 py-4 text-sm text-[#4A5676]">
            {contactSettings.botTokenConfigured
              ? "Токен бота настроен на сервере. Введите новый токен только если хотите заменить текущий."
              : "Токен бота еще не настроен. Введите его ниже и сохраните настройки."}
          </div>

          <form
            id="telegram-settings-form"
            onSubmit={handleContactSettingsSubmit}
            className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                Токен бота
              </span>
              <input
                type="password"
                value={contactSettingsForm.telegramBotToken}
                onChange={(event) =>
                  setContactSettingsForm((current) => ({
                    ...current,
                    telegramBotToken: event.target.value,
                  }))
                }
                className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder={
                  contactSettings.botTokenConfigured
                    ? "Оставьте пустым, чтобы не менять токен"
                    : "Введите bot token"
                }
                autoComplete="new-password"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                ID группы / чата
              </span>
              <input
                type="password"
                value={contactSettingsForm.telegramChatId}
                onChange={(event) =>
                  setContactSettingsForm((current) => ({
                    ...current,
                    telegramChatId: event.target.value,
                  }))
                }
                className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="-100..."
                autoComplete="off"
              />
            </label>
          </form>
        </section>

        <div className="grid gap-4 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.value} className="rounded-[20px] bg-white p-5 shadow-[0_18px_45px_rgba(22,34,108,0.08)]">
              <div className="text-xs uppercase tracking-[0.2em] text-[#6C7485]">{item.value}</div>
              <div className="mt-3 text-2xl font-semibold text-[#1C2561]">{item.count}</div>
              <div className="mt-2 text-sm text-[#4A5676]">{item.title}</div>
            </div>
          ))}
        </div>

        {loading ? <div className="rounded-[18px] bg-[#F7F9FC] px-5 py-4 text-sm text-[#4A5676]">Загрузка препаратов...</div> : null}
        {error ? <div className="rounded-[18px] border border-[#F1C9CC] bg-[#FFF1F2] px-5 py-4 text-sm text-[#A32024]">{error}</div> : null}

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(22,34,108,0.08)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#1C2561]">Каталог</h2>
              <button type="button" onClick={handleReset} disabled={saving} className="rounded-full border border-[#F1C9CC] px-4 py-2 text-xs font-semibold text-[#F61114] transition hover:bg-[#FFF1F2] disabled:cursor-not-allowed disabled:opacity-60">Сброс</button>
            </div>
            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} className="mb-4 w-full rounded-[14px] border border-[#D8DEEA] bg-[#F7F9FC] px-4 py-3 outline-none transition focus:border-[#1C2561]" placeholder="Поиск по названию" />
            <div className="max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {filteredProducts.map((product) => {
                const productPreview = resolveProductImage(product.image);
                return (
                  <div key={product.id} className={`rounded-[18px] border p-4 transition ${selectedId === product.id ? "border-[#1C2561] bg-[#F7F9FF]" : "border-[#E5EAF2] bg-white"}`}>
                    <button type="button" onClick={() => handleSelectProduct(product)} className="w-full text-left">
                      <div className="flex items-start gap-4">
                        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[16px] bg-[#F3F7FB]">
                          {productPreview ? <img src={productPreview} alt="" className="h-[58px] w-[58px] object-contain" /> : <span className="text-xs text-[#6C7485]">Нет изображения</span>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs uppercase tracking-[0.18em] text-[#6C7485]">{getCategoryTitle(product.category, categories)}</div>
                          <div className="mt-2 truncate text-base font-semibold text-[#1C2561]">{product.name}</div>
                          <div className="mt-2 line-clamp-2 text-sm text-[#4A5676]">{product.summary || "Нет описания"}</div>
                        </div>
                      </div>
                    </button>
                    <button type="button" onClick={() => handleDelete(product.id)} disabled={saving} className="mt-4 rounded-full border border-[#F1C9CC] px-4 py-2 text-xs font-semibold text-[#F61114] transition hover:bg-[#FFF1F2] disabled:cursor-not-allowed disabled:opacity-60">Удалить</button>
                  </div>
                );
              })}
              {!loading && filteredProducts.length === 0 ? <div className="rounded-[18px] border border-dashed border-[#D8DEEA] p-5 text-sm text-[#6C7485]">Препараты не найдены.</div> : null}
            </div>
          </aside>

          <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(22,34,108,0.08)] lg:p-8">
            <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">{isCreating ? "Создание" : "Редактирование"}</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#1C2561]">{isCreating ? "Новый препарат" : selectedProduct?.name ?? "Редактирование препарата"}</h2>
              </div>
              {selectedProduct ? <div className="text-sm text-[#6C7485]">Категория: {getCategoryTitle(selectedProduct.category, categories)}</div> : null}
            </div>

            <ProductForm
              categories={categoryOptions}
              formState={formState}
              onChange={(field, value) => setFormState((current) => ({ ...current, [field]: value }))}
              onDetailChange={(index, field, value) => setFormState((current) => ({ ...current, desc: current.desc.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }))}
              onDetailAdd={() => setFormState((current) => ({ ...current, desc: [...current.desc, { ...EMPTY_DETAIL }] }))}
              onDetailRemove={(index) => setFormState((current) => ({ ...current, desc: current.desc.filter((_, itemIndex) => itemIndex !== index) }))}
              onImageUpload={handleImageUpload}
              onSubmit={handleSubmit}
              preview={preview}
              submitLabel={isCreating ? "Добавить препарат" : "Сохранить изменения"}
              saving={saving}
              uploadingImage={uploadingImage}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
