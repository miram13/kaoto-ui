import { IStepProps } from '../types';
import request from './request';

export async function fetchCatalogSteps(queryParams?: {
  // e.g. 'KameletBinding'
  dsl?: string;
  // e.g. 'Kamelet'
  kind?: string;
  // e.g. 'START', 'END', 'MIDDLE'
  type?: string;
}) {
  try {
    const resp = await request.get({
      endpoint: '/step',
      queryParams,
    });

    return await resp.json();
  } catch (err) {
    console.error(err);
    return err;
  }
}

/**
 * Returns the custom resource (YAML).
 * Usually to update the YAML after a change in the integration from the Visualization.
 * Requires a list of all new steps.
 * @param newSteps
 * @param integrationName
 */
export async function fetchCustomResource(newSteps: IStepProps[], integrationName: string) {
  try {
    const resp = await request.post({
      endpoint: '/integrations/customResource',
      contentType: 'application/json',
      body: { name: integrationName.toLowerCase(), steps: newSteps },
    });

    return await resp.text();
  } catch (err) {
    return err;
  }
}

/**
 * Returns a list of all domain-specific languages (DSLs)
 */
export async function fetchAllDSLs() {
  try {
    const resp = await request.get({
      endpoint: '/languages',
      contentType: 'application/json',
    });

    return await resp.json();
  } catch (err) {
    return err;
  }
}

/**
 * Returns a list of domain-specific languages (DSLs) compatible
 * with existing steps. Will also include the respective YAML/CRD
 * for each compatible DSL.
 */
export async function fetchCompatibleDSLsAndCRDs(props: {
  integrationName: string;
  dsl?: string;
  steps: IStepProps[];
}) {
  try {
    const resp = await request.post({
      endpoint: '/integrations/customResources?dsl=' + props.dsl,
      contentType: 'application/json',
      body: { name: props.integrationName.toLowerCase(), steps: props.steps },
    });

    return await resp.json();
  } catch (err) {
    return err;
  }
}

export async function fetchDeployments() {
  try {
    const resp = await request.get({
      endpoint: '/integrations',
      contentType: 'application/json',
    });

    return await resp.json();
  } catch (err) {
    return err;
  }
}

/**
 * Returns view definitions (JSON).
 * Typically used after updating the integration from the YAML Editor,
 * or for step replacement that requires an updated array of views.
 * Accepts YAML or steps as type IStepProps[].
 * @param data
 */
export async function fetchViewDefinitions(data: string | IStepProps[]) {
  try {
    const resp = await request.post({
      endpoint: '/viewdefinition',
      contentType: typeof data === 'string' ? 'text/yaml' : 'application/json',
      body: data,
    });

    return await resp.json();
  } catch (err) {
    console.error(err);
    return err;
  }
}

/**
 * Starts an integration deployment
 * @param dsl
 * @param integration
 * @param integrationName
 * @param namespace
 */
export async function startDeployment(
  dsl: string,
  integration: any,
  integrationName: string,
  namespace: string
) {
  try {
    const resp = await request.post({
      endpoint: '/integrations?type=' + dsl + '&namespace=' + namespace,
      contentType: 'application/json',
      body: { name: integrationName.toLowerCase(), steps: integration },
    });

    return await resp.text();
  } catch (err) {
    throw err;
  }
}

/**
 * Stops an integration deployment
 * @param integrationName
 */
export async function stopDeployment(integrationName: string) {
  try {
    const resp = await request.delete({
      endpoint: '/integrations/' + integrationName.toLowerCase(),
      contentType: 'application/json',
    });

    return await resp.text();
  } catch (err) {
    throw err;
  }
}
