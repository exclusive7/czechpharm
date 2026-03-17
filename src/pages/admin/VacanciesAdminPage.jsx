import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell from "../../components/admin/AdminShell";
import {
  createVacancy,
  deleteVacancy,
  updateVacancy,
} from "../../data/vacanciesStore";
import { useVacancies } from "../../hooks/useVacancies";

const EMPTY_TEXT_ITEM = "";

function slugify(value, fallback = "vacancy") {
  const normalizedValue = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalizedValue || fallback;
}

function buildVacancyForm(vacancy) {
  return {
    title: vacancy?.title ?? "",
    slug: vacancy?.slug ?? "",
    location: vacancy?.location ?? "",
    type: vacancy?.type ?? "",
    date: vacancy?.date ?? "",
    description: vacancy?.description ?? "",
    responsibilities:
      Array.isArray(vacancy?.responsibilities) && vacancy.responsibilities.length > 0
        ? [...vacancy.responsibilities]
        : [EMPTY_TEXT_ITEM],
    requirements:
      Array.isArray(vacancy?.requirements) && vacancy.requirements.length > 0
        ? [...vacancy.requirements]
        : [EMPTY_TEXT_ITEM],
    conditions:
      Array.isArray(vacancy?.conditions) && vacancy.conditions.length > 0
        ? [...vacancy.conditions]
        : [EMPTY_TEXT_ITEM],
    closingNote: vacancy?.closingNote ?? "",
    applyLabel: vacancy?.applyLabel ?? "",
    applyUrl: vacancy?.applyUrl ?? "",
  };
}

function vacancyPayload(formState) {
  return {
    title: formState.title.trim(),
    slug: slugify(formState.slug || formState.title, "vacancy"),
    location: formState.location.trim(),
    type: formState.type.trim(),
    date: formState.date.trim(),
    description: formState.description.trim(),
    responsibilities: formState.responsibilities
      .map((item) => item.trim())
      .filter(Boolean),
    requirements: formState.requirements.map((item) => item.trim()).filter(Boolean),
    conditions: formState.conditions.map((item) => item.trim()).filter(Boolean),
    closingNote: formState.closingNote.trim(),
    applyLabel: formState.applyLabel.trim(),
    applyUrl: formState.applyUrl.trim(),
  };
}

function ListEditor({ label, items, onChange }) {
  return (
    <div className="rounded-[18px] border border-[#D8DEEA] bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-[#1C2561]">{label}</h3>
        <button
          type="button"
          onClick={() => onChange([...items, EMPTY_TEXT_ITEM])}
          className="rounded-full border border-[#1C2561] px-4 py-2 text-sm font-semibold text-[#1C2561] transition hover:bg-[#1C2561] hover:text-white"
        >
          Добавить пункт
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${label}-${index}`}
            className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_44px]"
          >
            <input
              type="text"
              value={item}
              onChange={(event) =>
                onChange(
                  items.map((currentItem, itemIndex) =>
                    itemIndex === index ? event.target.value : currentItem
                  )
                )
              }
              className="rounded-[14px] border border-[#D8DEEA] px-4 py-3 outline-none transition focus:border-[#1C2561]"
              placeholder="Текст пункта"
            />
            <button
              type="button"
              onClick={() =>
                onChange(
                  items.length > 1
                    ? items.filter((_, itemIndex) => itemIndex !== index)
                    : [EMPTY_TEXT_ITEM]
                )
              }
              className="rounded-[14px] border border-[#F1C9CC] text-lg font-semibold text-[#F61114] transition hover:bg-[#FFF1F2]"
              aria-label={`Удалить пункт ${label}`}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VacanciesAdminPage() {
  const { vacancies, loading, error } = useVacancies();
  const [selectedId, setSelectedId] = useState(null);
  const [isCreating, setIsCreating] = useState(true);
  const [search, setSearch] = useState("");
  const [formState, setFormState] = useState(() => buildVacancyForm(null));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const selectedVacancy = vacancies.find((item) => item.id === selectedId) ?? null;
  const filteredVacancies = vacancies.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    if (selectedId && !vacancies.some((item) => item.id === selectedId)) {
      setSelectedId(null);
      setIsCreating(true);
      setFormState(buildVacancyForm(null));
    }
  }, [selectedId, vacancies]);

  const pushNotice = (type, message) => setNotice({ type, message });

  const handleCreateNew = () => {
    setSelectedId(null);
    setIsCreating(true);
    setFormState(buildVacancyForm(null));
  };

  const handleSelectVacancy = (vacancy) => {
    setSelectedId(vacancy.id);
    setIsCreating(false);
    setFormState(buildVacancyForm(vacancy));
  };

  const handleFieldChange = (field, value) => {
    setFormState((current) => {
      if (field === "title") {
        const currentSlugFromTitle = slugify(current.title, "vacancy");
        const shouldSyncSlug = !current.slug || current.slug === currentSlugFromTitle;

        return {
          ...current,
          title: value,
          slug: shouldSyncSlug ? slugify(value, "vacancy") : current.slug,
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = vacancyPayload(formState);

    if (!payload.title) {
      pushNotice("error", "Название вакансии обязательно.");
      return;
    }

    setSaving(true);

    try {
      if (isCreating) {
        const createdVacancy = await createVacancy(payload);
        setSelectedId(createdVacancy.id);
        setIsCreating(false);
        setFormState(buildVacancyForm(createdVacancy));
        pushNotice("success", "Вакансия добавлена.");
      } else if (selectedVacancy) {
        const updatedVacancy = await updateVacancy(selectedVacancy.id, payload);
        setFormState(buildVacancyForm(updatedVacancy));
        pushNotice("success", "Вакансия сохранена.");
      }
    } catch (saveError) {
      pushNotice("error", saveError.message || "Не удалось сохранить вакансию.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vacancyId) => {
    const vacancy = vacancies.find((item) => item.id === vacancyId);

    if (!vacancy || !window.confirm(`Удалить вакансию "${vacancy.title}"?`)) {
      return;
    }

    setSaving(true);

    try {
      await deleteVacancy(vacancyId);
      handleCreateNew();
      pushNotice("success", "Вакансия удалена.");
    } catch (deleteError) {
      pushNotice("error", deleteError.message || "Не удалось удалить вакансию.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Вакансии"
      description="Управляйте списком вакансий и полным содержимым страниц деталей: описанием, требованиями, условиями и ссылкой для отклика."
      actions={
        <>
          <Link
            to="/vacancies"
            className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Открыть вакансии
          </Link>
          <button
            type="button"
            onClick={handleCreateNew}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1C2561] transition hover:bg-[#EEF2FF]"
          >
            Новая вакансия
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
            <h2 className="text-lg font-semibold text-[#1C2561]">Вакансии</h2>
            <span className="rounded-full bg-[#F4F7FB] px-3 py-1 text-xs font-semibold text-[#1C2561]">
              {vacancies.length}
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
            {filteredVacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className={`rounded-[18px] border p-4 transition ${
                  selectedId === vacancy.id
                    ? "border-[#1C2561] bg-[#F7F9FF]"
                    : "border-[#E5EAF2] bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectVacancy(vacancy)}
                  className="w-full text-left"
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6C7485]">
                    {vacancy.slug}
                  </div>
                  <div className="mt-2 text-base font-semibold text-[#1C2561]">
                    {vacancy.title}
                  </div>
                  <div className="mt-2 text-sm text-[#4A5676]">
                    {vacancy.location || "Локация не указана"}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(vacancy.id)}
                  disabled={saving}
                  className="mt-4 rounded-full border border-[#F1C9CC] px-4 py-2 text-xs font-semibold text-[#F61114] transition hover:bg-[#FFF1F2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Удалить
                </button>
              </div>
            ))}

            {!loading && filteredVacancies.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#D8DEEA] p-5 text-sm text-[#6C7485]">
                Вакансии не найдены.
              </div>
            ) : null}
          </div>
        </aside>

        <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(22,34,108,0.08)] lg:p-8">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">
              {isCreating ? "Создание" : "Редактирование"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1C2561]">
              {isCreating ? "Новая вакансия" : selectedVacancy?.title ?? "Вакансия"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Название вакансии
                </span>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(event) => handleFieldChange("title", event.target.value)}
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                  placeholder="Название вакансии"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Slug
                </span>
                <input
                  type="text"
                  value={formState.slug}
                  onChange={(event) => handleFieldChange("slug", event.target.value)}
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                  placeholder="medical-representative"
                />
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Локация
                </span>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(event) => handleFieldChange("location", event.target.value)}
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                  placeholder="Ташкент, Узбекистан"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Тип занятости
                </span>
                <input
                  type="text"
                  value={formState.type}
                  onChange={(event) => handleFieldChange("type", event.target.value)}
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                  placeholder="Полная занятость"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Дата
                </span>
                <input
                  type="text"
                  value={formState.date}
                  onChange={(event) => handleFieldChange("date", event.target.value)}
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                  placeholder="23.10.2023"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                Описание вакансии
              </span>
              <textarea
                value={formState.description}
                onChange={(event) => handleFieldChange("description", event.target.value)}
                className="min-h-[120px] w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="Основной текст вакансии"
              />
            </label>

            <ListEditor
              label="Функциональные обязанности"
              items={formState.responsibilities}
              onChange={(value) => handleFieldChange("responsibilities", value)}
            />
            <ListEditor
              label="Требования к кандидату"
              items={formState.requirements}
              onChange={(value) => handleFieldChange("requirements", value)}
            />
            <ListEditor
              label="Условия"
              items={formState.conditions}
              onChange={(value) => handleFieldChange("conditions", value)}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                Дополнительная заметка
              </span>
              <textarea
                value={formState.closingNote}
                onChange={(event) => handleFieldChange("closingNote", event.target.value)}
                className="min-h-[100px] w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                placeholder="Финальный текст на странице вакансии"
              />
            </label>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Текст ссылки для отклика
                </span>
                <input
                  type="text"
                  value={formState.applyLabel}
                  onChange={(event) => handleFieldChange("applyLabel", event.target.value)}
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                  placeholder="@HR_CzechfarmAlliance"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
                  Ссылка для отклика
                </span>
                <input
                  type="text"
                  value={formState.applyUrl}
                  onChange={(event) => handleFieldChange("applyUrl", event.target.value)}
                  className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
                  placeholder="https://t.me/..."
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#F61114] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d71013] disabled:cursor-not-allowed disabled:bg-[#F39B9D]"
            >
              {saving
                ? "Сохранение..."
                : isCreating
                  ? "Добавить вакансию"
                  : "Сохранить изменения"}
            </button>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
