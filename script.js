const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`No se pudo cargar events.json (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("El formato de events.json no es válido.");
    }

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
      repositoryList.append(item);
    }

    statusMessage.textContent = repositories.length
      ? ""
      : "Todavía no hay repositorios destacados.";
  } catch (error) {
    statusMessage.textContent =
      "No se pudieron cargar los repositorios. Inténtalo de nuevo más tarde.";
    console.error(error);
  }
}

loadRepositories();