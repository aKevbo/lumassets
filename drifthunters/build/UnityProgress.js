function UnityProgress(gameInstance, progress) {
  if (!gameInstance.Module) return;

  if (!gameInstance.logo) {
    gameInstance.logo = document.createElement("div");
    gameInstance.logo.className = "logo " + gameInstance.Module.splashScreenStyle;
    gameInstance.container.appendChild(gameInstance.logo);
  }

  if (!gameInstance.progress) {
    gameInstance.progress = document.createElement("div");
    gameInstance.progress.className = "progress " + gameInstance.Module.splashScreenStyle;
    gameInstance.progress.empty = document.createElement("div");
    gameInstance.progress.empty.className = "empty";
    gameInstance.progress.appendChild(gameInstance.progress.empty);
    gameInstance.progress.full = document.createElement("div");
    gameInstance.progress.full.className = "full";
    gameInstance.progress.appendChild(gameInstance.progress.full);
    gameInstance.container.appendChild(gameInstance.progress);
  }

  if (!gameInstance.totalProgress) {
    gameInstance.totalProgress = 0;
    gameInstance.currentFile = 1;
    gameInstance.loadedParts = [];
  }

  if (gameInstance.currentFile === 1) {
    gameInstance.totalProgress = progress * 0.5; // First file contributes 50%
    if (progress === 1) {
      gameInstance.currentFile = 2;

      // Fetch the second part (use the full URL)
      fetch('https://rawcdn.githack.com/aKevbo/lumassets/9b7e4613eb9c96d59294bd89584ecaf3321a0e22/drifthunters/build/unity/itchio.data.unityweb.002')
        .then(response => response.arrayBuffer())
        .then(dataPart2 => {
          if (!gameInstance.Module.dataFileBytes) {
            console.error("Data from the first file is not available yet.");
            return;
          }

          // Combine both parts
          const dataPart1 = gameInstance.Module.dataFileBytes; // First part preloaded by Unity
          const combinedData = new Uint8Array(dataPart1.byteLength + dataPart2.byteLength);
          combinedData.set(new Uint8Array(dataPart1), 0);
          combinedData.set(new Uint8Array(dataPart2), dataPart1.byteLength);

          // Pass the combined file back to Unity
          gameInstance.Module.FS_createPreloadedFile(
            '/',
            'data.unityweb',
            combinedData,
            true,
            true
          );

          gameInstance.totalProgress = 1; // Loading complete
        })
        .catch(error => {
          console.error('Error loading second data file:', error);
        });
    }
  }

  gameInstance.progress.full.style.width = (100 * gameInstance.totalProgress) + "%";
  gameInstance.progress.empty.style.width = (100 * (1 - gameInstance.totalProgress)) + "%";

  if (gameInstance.totalProgress === 1) {
    gameInstance.logo.style.display = gameInstance.progress.style.display = "none";
  }
}
