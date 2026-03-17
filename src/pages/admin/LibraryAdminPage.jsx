import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell from "../../components/admin/AdminShell";
import {
  createLibraryItem,
  deleteLibraryItem,
  isKnownLibraryImage,
  isKnownLibraryPdf,
  libraryImageOptions,
  libraryPdfOptions,
  resolveLibraryAsset,
  updateLibraryItem,
} from "../../data/libraryStore";
import { uploadAsset } from "../../data/uploadsStore";
import { useLibraryItems } from "../../hooks/useLibraryItems";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл."));
    reader.readAsDataURL(file);
  });
}

function buildLibraryForm(item) {
  const useAssetImage = isKnownLibraryImage(item?.image ?? "");
  const useAssetPdf = isKnownLibraryPdf(item?.pdf ?? "");

  return {
    title: item?.title ?? "",
    text: item?.text ?? "",
    imageAsset: useAssetImage ? item?.image ?? "" : "",
    imageUrl: useAssetImage ? "" : item?.image ?? "",
    pdfAsset: useAssetPdf ? item?.pdf ?? "" : "",
    pdfUrl: useAssetPdf ? "" : item?.pdf ?? "",
  };
}

function libraryPayload(formState) {
  return {
    title: formState.title.trim(),
    text: formState.text.trim(),
    image: formState.imageUrl.trim() || formState.imageAsset.trim(),
    pdf: formState.pdfUrl.trim() || formState.pdfAsset.trim(),
  };
}

export default function LibraryAdminPage() {
  const { libraryItems, loading, error } = useLibraryItems();
  const [selectedId, setSelectedId] = useState(null);
  const [isCreating, setIsCreating] = useState(true);
  const [search, setSearch] = useState("");
  const [formState, setFormState] = useState(() => buildLibraryForm(null));
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [notice, setNotice] = useState(null);

  const selectedItem = libraryItems.find((item) => item.id === selectedId) ?? null;
  const filteredItems = libraryItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );
  const imagePreview = resolveLibraryAsset(formState.imageUrl || formState.imageAsset);
  const pdfPreview = resolveLibraryAsset(formState.pdfUrl || formState.pdfAsset);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    if (selectedId && !libraryItems.some((item) => item.id === selectedId)) {
      setSelectedId(null);
      setIsCreating(true);
      setFormState(buildLibraryForm(null));
    }
  }, [libraryItems, selectedId]);

  const pushNotice = (type, message) => setNotice({ type, message });

  const handleCreateNew = () => {
    setSelectedId(null);
    setIsCreating(true);
    setFormState(buildLibraryForm(null));
  };

  const handleSelectItem = (item) => {
    setSelectedId(item.id);
    setIsCreating(false);
    setFormState(buildLibraryForm(item));
  };

  const handleUpload = async (event, field) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const setUploading = field === "image" ? setUploadingImage : setUploadingPdf;
    setUploading(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const fileUrl = await uploadAsset({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        base64Data: dataUrl.split(",")[1] ?? "",
      });

      setFormState((current) => ({
        ...current,
        ...(field === "image"
          ? { imageUrl: fileUrl, imageAsset: "" }
          : { pdfUrl: fileUrl, pdfAsset: "" }),
      }));

      pushNotice(
        "success",
        field === "image" ? "Изображение загружено." : "PDF загружен."
      );
    } catch (uploadError) {
      pushNotice("error", uploadError.message || "Не удалось загрузить файл.");
    } finally {
      event.target.value = "";
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = libraryPayload(formState);

    if (!payload.title) {
      pushNotice("error", "Название материала обязательно.");
      return;
    }

    setSaving(true);

    try {
      if (isCreating) {
        const createdItem = await createLibraryItem(payload);
        setSelectedId(createdItem.id);
        setIsCreating(false);
        setFormState(buildLibraryForm(createdItem));
        pushNotice("success", "Материал библиотеки добавлен.");
      } else if (selectedItem) {
        const updatedItem = await updateLibraryItem(selectedItem.id, payload);
        setFormState(buildLibraryForm(updatedItem));
        pushNotice("success", "Материал библиотеки сохранен.");
      }
    } catch (saveError) {
      pushNotice("error", saveError.message || "Не удалось сохранить материал.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId) => {
    const item = libraryItems.find((entry) => entry.id === itemId);

    if (!item || !window.confirm(`Удалить материал "${item.title}"?`)) {
      return;
    }

    setSaving(true);

    try {
      await deleteLibraryItem(itemId);
      handleCreateNew();
      pushNotice("success", "Материал библиотеки удален.");
    } catch (deleteError) {
      pushNotice("error", deleteError.message || "Не удалось удалить материал.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Библиотека"
      description="Управляйте карточками библиотеки: названием, описанием, изображением и PDF-файлом."
      actions={
        <>
          <Link
            to="/library"
            className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Открыть библиотеку
          </Link>
          <button
            type="button"
            onClick={handleCreateNew}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1C2561] transition hover:bg-[#EEF2FF]"
          >
            Новый материал
          </button>
        </>
      }
    >
      {notice ? (
        <div
          className={`rounded-[18px] px-5 py-4 text-sm ${
            notice.type === "error"
              ? "border border-[#F1C9CC] bg-[#FFF1F2] text-[#A32024]"
              : "border border-[#C7E1CF] bg-[#EDF9F1] text-[#24613A]"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[18px] border border-[#F1C9CC] bg-[#FFF1F2] px-5 py-4 text-sm text-[#A32024]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(22,34,108,0.08)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#1C2561]">Материалы</h2>
            <span className="rounded-full bg-[#F4F7FB] px-3 py-1 text-xs font-semibold text-[#1C2561]">
              {libraryItems.length}
            </span>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mb-4 w-full rounded-[14px] border border-[#D8DEEA] bg-[#F7F9FC] px-4 py-3 outline-none transition focus:border-[#1C2561]"
            placeholder="Поиск по названию"
          />

          <div className="max-h-[720px] space-y-3 overflow-y-auto pr-1">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-[18px] border p-4 transition ${
                  selectedId === item.id
                    ? "border-[#1C2561] bg-[#F7F9FF]"
                    : "border-[#E5EAF2] bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[16px] bg-[#F3F7FB]">
                      {item.image ? (
                        <img
                          src={resolveLibraryAsset(item.image)}
                          alt=""
                          className="h-[58px] w-[58px] object-cover"
                        />
                      ) : (
                        <span className="text-xs text-[#6C7485]">Нет фото</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-base font-semibold text-[#1C2561]">
                        {item.title}
                      </div>
                      <div className="mt-2 line-clamp-2 text-sm text-[#4A5676]">
                        {item.text || "Описание не заполнено"}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={saving}
                  className="mt-4 rounded-full border border-[#F1C9CC] px-4 py-2 text-xs font-semibold text-[#F61114] transition hover:bg-[#FFF1F2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Удалить
                </button>
              </div>
            ))}

            {!loading && filteredItems.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#D8DEEA] p-5 text-sm text-[#6C7485]">
                Материалы не найдены.
              </div>
            ) : null}
          </div>
        </aside>

        <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(22,34,108,0.08)] lg:p-8">
          <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">
                {isCreating ? "Создание" : "Редактирование"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#1C2561]">
                {isCreating ? "Новый материал" : selectedItem?.title ?? "Материал"}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                Название
              </span>
              <input
                type="text"
                value={formState.title}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, title: event.target.value }))
                }
                className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="Название материала"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                Описание
              </span>
              <textarea
                value={formState.text}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, text: event.target.value }))
                }
                className="min-h-[120px] w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="Краткое описание материала"
              />
            </label>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Изображение из проекта
                </span>
                <select
                  value={formState.imageAsset}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      imageAsset: event.target.value,
                    }))
                  }
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                >
                  <option value="">Выберите файл</option>
                  {libraryImageOptions.map((image) => (
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
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      imageUrl: event.target.value,
                    }))
                  }
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                  placeholder="/uploads/... или https://..."
                />
              </label>

              <div className="rounded-[18px] border border-dashed border-[#D8DEEA] bg-[#F7F9FC] p-4">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Превью
                </span>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt=""
                    className="h-[120px] w-full object-contain"
                  />
                ) : (
                  <div className="flex h-[120px] items-center justify-center text-sm text-[#6C7485]">
                    Нет изображения
                  </div>
                )}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                Загрузить изображение
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleUpload(event, "image")}
                className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 text-sm"
              />
              <span className="mt-2 block text-xs text-[#6C7485]">
                {uploadingImage
                  ? "Загрузка изображения..."
                  : "Файл будет сохранен в public/uploads."}
              </span>
            </label>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  PDF из проекта
                </span>
                <select
                  value={formState.pdfAsset}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      pdfAsset: event.target.value,
                    }))
                  }
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                >
                  <option value="">Без PDF</option>
                  {libraryPdfOptions.map((pdf) => (
                    <option key={pdf} value={pdf}>
                      {pdf}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Внешний или загруженный PDF URL
                </span>
                <input
                  type="text"
                  value={formState.pdfUrl}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      pdfUrl: event.target.value,
                    }))
                  }
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                  placeholder="/uploads/... или https://..."
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                Загрузить PDF
              </span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => handleUpload(event, "pdf")}
                className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 text-sm"
              />
              <span className="mt-2 block text-xs text-[#6C7485]">
                {uploadingPdf ? "Загрузка PDF..." : "Файл будет сохранен в public/uploads."}
              </span>
            </label>

            {pdfPreview ? (
              <a
                href={pdfPreview}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-[#1C2561] px-5 py-3 text-sm font-semibold text-[#1C2561] transition hover:bg-[#1C2561] hover:text-white"
              >
                Открыть PDF
              </a>
            ) : null}

            <button
              type="submit"
              disabled={saving || uploadingImage || uploadingPdf}
              className="rounded-full bg-[#F61114] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d71013] disabled:cursor-not-allowed disabled:bg-[#F39B9D]"
            >
              {saving
                ? "Сохранение..."
                : isCreating
                  ? "Добавить материал"
                  : "Сохранить изменения"}
            </button>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
