const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

function isRepository(value) {
  if (
    typeof value !== "object" ||
    value === null ||
    !["name", "owner", "description", "url", "stars"].every(
      (field) => typeof value[field] === "string" && value[field].trim()
    )
  ) {
    return false;
  }

  try {
    const url = new URL(value.url);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function loadRepositories() {
  if (!(repositoryList instanceof HTMLUListElement) || !statusMessage) {
    console.error(
      "No se encontraron los elementos requeridos para mostrar los repositorios."
    );
    return;
  }

  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`No se pudo cargar events.json (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories) || !repositories.every(isRepository)) {
      throw new Error("El formato de events.json no es válido.");
    }

    const fragment = document.createDocumentFragment();
    for (const repository of repositories) {
      const item = document.createElement("li");
      item.className = "repository-card";

      const heading = document.createElement("h3");
      const link = document.createElement("a");
      link.href = repository.url;
      link.textContent = `${repository.owner}/${repository.name}`;
      heading.append(link);

      const description = document.createElement("p");
      description.textContent = repository.description;

      const metadata = document.createElement("span");
      metadata.className = "repository-meta";
      metadata.textContent = repository.stars;

      item.append(heading, description, metadata);
      fragment.append(item);
    }

    repositoryList.replaceChildren(fragment);
    statusMessage.textContent = repositories.length
      ? `Se cargaron ${repositories.length} repositorios destacados.`
      : "Todavía no hay repositorios destacados.";
  } catch (error) {
    statusMessage.textContent =
      "No se pudieron cargar los repositorios. Inténtalo de nuevo más tarde.";
    console.error("Error al cargar los repositorios:", error);
  }
}

loadRepositories();